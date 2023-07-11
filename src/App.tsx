import { useState } from 'react';
import { WorkBook, read, utils, writeFile } from 'xlsx';
import './App.css';
/* eslint-disable */
function App() {
  const [file, setFile] = useState<Blob>();
  const [rows, setRows] = useState<any>([] as any);
  const [columns, setColumns] = useState<any>([] as any);
  const [filteredRow, setFilteredRow] = useState<any>([] as any);

  const handleSubmit = () => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = e.target?.result;
      const workbook = read(data, { type: 'binary' });
      workbook.SheetNames.forEach((sheetName) => {
        const XL_row_object = utils.sheet_to_json(
          workbook.Sheets[sheetName] as WorkBook
        );

        // const json_object = JSON.stringify(XL_row_object);
        // console.log(json_object);
        setRows(XL_row_object as any);
        setFilteredRow(XL_row_object as any);
        const workbookHeaders = read(data, { sheetRows: 1, type: 'binary' });
        const columnsArray = utils.sheet_to_json(
          workbookHeaders.Sheets[sheetName] as WorkBook,
          { header: 1 }
        )[0];
        console.log(columnsArray);
        setColumns(columnsArray as any);
      });
    };
    fileReader.readAsBinaryString(file as Blob);
  };

  const exportToExcel = () => {
    let data = [columns];

    filteredRow.forEach((element: any) => {
      let row: any = [];
      Object.keys(element).forEach(function (key, index) {
        row.push(element[key]);
      });

      data.push(row);
    });

    // Sample data

    // Create a new workbook and worksheet
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(data);

    // Add the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate the XLSX file
    writeFile(workbook, 'filtered-data.xlsx');
  };

  const handleMissingData = () => {
    const columnLength = columns.length;
    const newRows = rows.filter((row: any) => {
      if (Object.keys(row).length !== columnLength) {
        return false;
      } else {
        return true;
      }
    });
    setFilteredRow(newRows);
  };

  const handleCheckMissingData = () => {
    const columnLength = columns.length;
    const newRows = rows.filter((row: any) => {
      if (Object.keys(row).length !== columnLength) {
        return true;
      } else {
        return false;
      }
    });
    setFilteredRow(newRows);
  };

  const handleClearFilterData = () => {
    const columnLength = columns.length;
    const newRows = rows.filter((row: any) => {
      if (Object.keys(row).length !== columnLength) {
        return true;
      } else {
        return false;
      }
    });
    setFilteredRow(rows);
  };

  return (
    <div className='mx-4 my-4'>
      <label
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
        htmlFor='file'
      >
        Upload File
      </label>
      <input
        onChange={(e) => {
          setFile(e.target.files![0]);
        }}
        className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
        type='file'
        id='file'
      />
      <div>
        <button
          type='button'
          onClick={handleSubmit}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-4 ml-0'
        >
          Submit File
        </button>

        <button
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded  m-4'
          type='button'
          onClick={handleMissingData}
        >
          Filter Missing data
        </button>

        <button
          className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-4'
          type='button'
          onClick={handleClearFilterData}
        >
          Clear Filter
        </button>
        <button
          className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-4 float-right'
          type='button'
        >
          Total Data:{filteredRow.length}
        </button>
        <button
          className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-4 float-right'
          type='button'
          onClick={exportToExcel}
        >
          Export
        </button>

        <button
          className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded  m-4'
          type='button'
          onClick={handleCheckMissingData}
        >
          Show Missing data
        </button>
      </div>

      <hr />
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='mt-8 flow-root'>
          <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 overflow-x'>
              <table className='min-w-full divide-y divide-gray-300 table-auto overflow-x-scroll w-full'>
                <thead>
                  <tr>
                    {columns?.map((column: any) => (
                      <th
                        scope='col'
                        className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredRow.length > 0 &&
                    filteredRow?.map((row: any, index: any) => (
                      <tr key={row[columns[0]]}>
                        <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0'>
                          {index + 1}
                        </td>
                        {columns.map((column: any) => (
                          <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0'>
                            {row[column] as any}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
