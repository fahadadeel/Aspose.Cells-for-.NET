using System;
using System.IO;
using Aspose.Cells;
using Aspose.Cells.Tables;

namespace Aspose.Cells.Examples.CSharp.Tables
{
    public class ApplyTableStyleToRange
    {
        public static void Run()
        {
            // ExStart:ApplyTableStyleToRange
            // The path to the documents directory.
            string dataDir = RunExamples.GetDataDir(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            // Create workbook
            Workbook workbook = new Workbook();
            
            // Access first worksheet
            Worksheet worksheet = workbook.Worksheets[0];
            
            // Add sample data
            worksheet.Cells["A1"].PutValue("Product");
            worksheet.Cells["B1"].PutValue("Quarter");
            worksheet.Cells["C1"].PutValue("Sales");
            
            worksheet.Cells["A2"].PutValue("Product A");
            worksheet.Cells["B2"].PutValue("Q1");
            worksheet.Cells["C2"].PutValue(5000);
            
            worksheet.Cells["A3"].PutValue("Product B");
            worksheet.Cells["B3"].PutValue("Q1");
            worksheet.Cells["C3"].PutValue(7500);
            
            worksheet.Cells["A4"].PutValue("Product C");
            worksheet.Cells["B4"].PutValue("Q2");
            worksheet.Cells["C4"].PutValue(6200);
            
            // Create a ListObject (Table)
            ListObjectCollection tables = worksheet.ListObjects;
            int index = tables.Add("A1", "C4", true);
            ListObject table = tables[index];
            
            // Apply table style
            table.TableStyleType = TableStyleType.TableStyleMedium9;
            
            // Auto fit columns
            worksheet.AutoFitColumns();
            
            // Save the workbook
            string outputDir = RunExamples.GetOutputDirectory();
            workbook.Save(outputDir + "ApplyTableStyleToRange_out.xlsx");
            
            Console.WriteLine("Table style applied successfully.");
            Console.WriteLine("File saved at: " + outputDir);
            // ExEnd:ApplyTableStyleToRange
        }
    }
}
