using System.IO;
using Aspose.Cells;
using Aspose.Cells.Tables;

namespace Aspose.Cells.Examples.CSharp.Tables
{
    public class ApplyTableStyleToRange
    {
        public static void Run()
        {
            // ExStart:1
            // The path to the documents directory.
            string dataDir = RunExamples.GetDataDir(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            // Create a new Workbook
            Workbook workbook = new Workbook();
            
            // Access the first worksheet
            Worksheet worksheet = workbook.Worksheets[0];

            // Add sample data to create a table
            worksheet.Cells["A1"].PutValue("Product");
            worksheet.Cells["B1"].PutValue("Quantity");
            worksheet.Cells["C1"].PutValue("Price");
            worksheet.Cells["D1"].PutValue("Total");

            worksheet.Cells["A2"].PutValue("Apple");
            worksheet.Cells["B2"].PutValue(50);
            worksheet.Cells["C2"].PutValue(1.50);
            worksheet.Cells["D2"].Formula = "=B2*C2";

            worksheet.Cells["A3"].PutValue("Banana");
            worksheet.Cells["B3"].PutValue(30);
            worksheet.Cells["C3"].PutValue(0.80);
            worksheet.Cells["D3"].Formula = "=B3*C3";

            worksheet.Cells["A4"].PutValue("Orange");
            worksheet.Cells["B4"].PutValue(40);
            worksheet.Cells["C4"].PutValue(1.20);
            worksheet.Cells["D4"].Formula = "=B4*C4";

            // Create a table (ListObject) from the data range
            ListObjectCollection tables = worksheet.ListObjects;
            int index = tables.Add("A1", "D4", true);
            ListObject table = tables[index];

            // Apply a predefined table style
            table.TableStyleType = TableStyleType.TableStyleMedium2;
            
            // Enable banded rows for better readability
            table.ShowTableStyleRowStripes = true;
            
            // Set the table name
            table.DisplayName = "ProductsTable";

            // Auto-fit columns for better display
            worksheet.AutoFitColumns();

            // Save the Excel file
            workbook.Save(dataDir + "ApplyTableStyleToRange_out.xlsx");
            // ExEnd:1
        }
    }
}
