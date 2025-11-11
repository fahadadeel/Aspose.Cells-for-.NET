# GitHub Copilot Instructions for Aspose.Cells .NET Examples

## 🏗️ Architecture Overview

This is a **.NET solution** demonstrating Aspose.Cells for .NET capabilities:

- **CSharp**: Main project containing all Excel/spreadsheet examples organized by category (Data/, Worksheets/, Formatting/, Charts/, etc.)
- **CellsExplorer**: WPF application for interactive exploration
- Multiple category folders for various Excel operations

## 🔑 Critical License Management Pattern

**License management** is important for Aspose.Cells operations. Check existing examples for license initialization patterns.

```csharp
// License initialization pattern (if used)
License license = new License();
license.SetLicense("Aspose.Cells.lic");
```

## 📁 File Output Convention

Examples typically output to the `Data/02_OutputDirectory/` folder:

```csharp
string outputDir = RunExamples.GetOutputDirectory();
string outputFile = outputDir + "output.xlsx";
workbook.Save(outputFile);
```

Console output uses descriptive messages to show progress.

## 🎯 Example Class Pattern

Static classes with `Run()` method that executes the example:

```csharp
public static class YourExample
{
    public static void Run()
    {
        // Excel/spreadsheet operations
        Workbook workbook = new Workbook();
        // ... example logic
        workbook.Save(outputFile);
    }
}
```

Examples are organized in `RunExamples.cs` by category.

## 🚀 Build & Run Commands

```bash
# Build entire solution
dotnet build Aspose.Cells.Examples.CSharp.sln

# Run examples
cd Examples/CSharp
dotnet run

# Run specific categories by modifying RunExamples.cs
```

## 🧪 Testing Requirements

Test files use `Guid.NewGuid():N` for unique names and **always cleanup** in finally blocks:

```csharp
var testOutputName = $"Test_Example_{Guid.NewGuid():N}";
try {
    Example.Run(testOutputName);
    Assert.True(File.Exists(expectedFile));
} finally {
    if (File.Exists(expectedFile)) File.Delete(expectedFile);
}
```

## ⚙️ Key Configuration

- **Target Framework**: .NET Framework (CSharp project uses Aspose.Cells)
- **Main Project**: Examples/CSharp with RunExamples.cs entry point
- **License Config**: License files in lib/ or project root
- **Directory Structure**: Examples/CSharp (main examples), Data/ (input/output), CellsExplorer (WPF app)

## 🎨 Excel Operations Patterns

Standard patterns for consistent output:
- Workbook and Worksheet management
- Cell formatting and styling
- Data manipulation and formulas
- Support for various Excel formats (XLS, XLSX, CSV, etc.)
- Use `Workbook` class for workbook operations, `Worksheet` for sheet operations

## 🔍 Common Pitfalls

- Never skip `LicenseHelper.SetLicense()` - causes evaluation mode
- Always use `AppContext.BaseDirectory` path resolution, not relative paths
- Include `Directory.CreateDirectory()` before file saves
- Follow emoji console output convention for user experience
- Test files must cleanup to avoid accumulation