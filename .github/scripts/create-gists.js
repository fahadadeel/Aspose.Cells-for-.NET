#!/usr/bin/env node

/**
 * Creates GitHub Gists for new example files.
 * This runs after example detection but before documentation generation.
 */

import axios from 'axios';
import { readFileSync, writeFileSync, appendFileSync } from 'fs';
import { existsSync } from 'fs';
import path from 'path';
import { program } from 'commander';
import { fileURLToPath } from 'url';

// Get the repository root directory (two levels up from .github/scripts)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');

class GistManager {
    constructor(githubToken) {
        this.githubToken = githubToken;
        this.githubHeaders = githubToken ? {
            'Content-Type': 'application/json',
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
        } : null;
    }

    /**
     * Extract basic analysis from code content for Gist description
     */
    analyzeCodeBasic(codeContent, filePath) {
        const pathObj = path.parse(filePath);
        const category = this.getCategoryFromPath(filePath);
        
        // Basic analysis from code
        const features = [];
        if (codeContent.includes('Workbook')) features.push('Workbook');
        if (codeContent.includes('Worksheet')) features.push('Worksheet');
        if (codeContent.includes('Cells')) features.push('Cells');
        if (codeContent.includes('Range')) features.push('Range');
        if (codeContent.includes('Chart')) features.push('Chart');

        const title = pathObj.name.replace('Example', '').replace(/_/g, ' ');
        
        return {
            title: title,
            category: category,
            barcode_types: features,
            description: `Demonstrates ${category.toLowerCase()} functionality in Aspose.Cells for .NET`
        };
    }

    /**
     * Extract category from file path
     */
    getCategoryFromPath(filePath) {
        const categories = ['Data', 'Worksheets', 'Formatting', 'Charts', 'Formulas', 'PivotTable', 'Tables'];
        for (const category of categories) {
            if (filePath.includes(category)) {
                return category;
            }
        }
        return 'General';
    }

    /**
     * Create a GitHub Gist with the example code
     */
    async createGist(codeContent, analysis, examplePath) {
        if (!this.githubToken) {
            console.log('⚠️ No GitHub token provided, skipping Gist creation');
            return null;
        }

        try {
            const fileName = path.basename(examplePath);
            const description = `${analysis.title} - Aspose.Cells for .NET Example`;
            
            const gistPayload = {
                description: description,
                public: true,
                files: {
                    [fileName]: {
                        content: codeContent
                    },
                    'README.md': {
                        content: `# ${analysis.title}\n\n${analysis.description}\n\n## Category\n\n${analysis.category}\n\n## Excel Features\n\n${analysis.barcode_types.length > 0 ? analysis.barcode_types.join(', ') : 'Various features supported'}\n\n## Usage\n\n1. Copy the C# code from this Gist\n2. Add it to your Aspose.Cells project\n3. Ensure you have the proper license setup\n4. Run the example\n\n---\n\n*This example is part of the [Aspose.Cells for .NET Examples](https://github.com/aspose-cells/Aspose.Cells-for-.NET) repository.*`
                    }
                }
            };

            console.log(`🔄 Creating GitHub Gist for: ${analysis.title}`);
            
            const response = await axios.post('https://api.github.com/gists', gistPayload, {
                headers: this.githubHeaders,
                timeout: 15000
            });

            const gistData = response.data;
            console.log(`✅ Gist created: ${gistData.html_url}`);
            
            return {
                id: gistData.id,
                url: gistData.html_url,
                rawUrl: gistData.files[fileName].raw_url,
                embedUrl: `<script src="${gistData.html_url}.js"></script>`,
                fileName: fileName,
                examplePath: examplePath
            };
        } catch (error) {
            console.log(`⚠️ Failed to create Gist: ${error.message}`);
            if (error.response) {
                console.log(`Response status: ${error.response.status}`);
                console.log(`Response data: ${JSON.stringify(error.response.data)}`);
            }
            return null;
        }
    }

    /**
     * Main method to create Gist for an example file
     */
    async createGistForExample(exampleFile, examplesRepoPath) {
        // Use absolute path resolution from repository root
        const examplePath = path.resolve(REPO_ROOT, exampleFile);
        
        console.log(`🔍 Looking for example file at: ${examplePath}`);
        
        if (!existsSync(examplePath)) {
            console.error(`❌ Example file not found: ${examplePath}`);
            return null;
        }
        
        // Read the example code
        const codeContent = readFileSync(examplePath, 'utf8');
        
        console.log(`🔍 Processing example: ${exampleFile}`);
        
        // Basic analysis for Gist metadata
        const analysis = this.analyzeCodeBasic(codeContent, examplePath);
        
        console.log(`📊 Basic analysis complete: ${analysis.title}`);
        
        // Create GitHub Gist
        const gistInfo = await this.createGist(codeContent, analysis, examplePath);
        
        if (gistInfo) {
            console.log(`🔗 Gist created successfully: ${gistInfo.url}`);
            
            // Save Gist info for the documentation generation step in the same directory as this script
            const scriptDir = path.dirname(fileURLToPath(import.meta.url));
            const gistDataFile = path.join(scriptDir, `gist-${path.basename(exampleFile, '.cs')}.json`);
            writeFileSync(gistDataFile, JSON.stringify(gistInfo, null, 2));
            console.log(`💾 Gist data saved: ${gistDataFile}`);
            
            return gistInfo;
        }
        
        return null;
    }
}

/**
 * Main function for CLI usage
 */
async function main() {
    program
        .requiredOption('--example-file <file>', 'Path to the example file')
        .requiredOption('--examples-repo <path>', 'Path to examples repository')
        .parse();

    const options = program.opts();
    
    // Get GitHub token from environment
    const githubToken = process.env.GITHUB_GIST_TOKEN || process.env.GITHUB_TOKEN;
    if (!githubToken) {
        console.log('⚠️ No GITHUB_GIST_TOKEN or GITHUB_TOKEN provided - Gist creation will be skipped');
        process.exit(0);
    }
    
    // Initialize Gist manager
    const gistManager = new GistManager(githubToken);
    
    // Create Gist
    try {
        const gistInfo = await gistManager.createGistForExample(
            options.exampleFile,
            options.examplesRepo
        );
        
        if (gistInfo) {
            // Output for GitHub Actions
            const githubOutput = process.env.GITHUB_OUTPUT;
            if (githubOutput) {
                appendFileSync(githubOutput, `gist_created=true\n`);
                appendFileSync(githubOutput, `gist_url=${gistInfo.url}\n`);
                appendFileSync(githubOutput, `gist_id=${gistInfo.id}\n`);
            }
            
            console.log('🎉 Gist creation completed successfully');
            process.exit(0);
        } else {
            console.log('⚠️ Gist creation was skipped or failed');
            process.exit(0);
        }
    } catch (error) {
        console.error(`❌ Error during Gist creation: ${error.message}`);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

// Export for testing
export { GistManager };