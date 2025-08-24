
import React from 'react';
import './App.css';
import * as XLSX from 'xlsx';

function App() {
  const [file, setFile] = React.useState(null);
  const [startTime, setStartTime] = React.useState('00:00');
  const [endTime, setEndTime] = React.useState('23:59');
  const [total, setTotal] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [tableData, setTableData] = React.useState([]);

  // Xử lý khi upload file qua input
  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    setFile(f);
    setTotal(null);
    setTableData([]);
    if (f) {
      if (!f.name.endsWith('.xlsx')) {
        setError('File không đúng định dạng .xlsx!');
        return;
      }
      setError('');
      try {
        const data = await f.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Đọc dữ liệu từ hàng 8 (bỏ qua 7 dòng đầu, dòng 8 là header)
        const rows = XLSX.utils.sheet_to_json(sheet, { range: 7 });
        setTableData(rows);
      } catch {
        setError('Lỗi đọc file hoặc định dạng file không đúng!');
      }
    }
  };

  // Xử lý khi drag & drop file
  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setFile(f);
      setTotal(null);
      setTableData([]);
      if (!f.name.endsWith('.xlsx')) {
        setError('File không đúng định dạng .xlsx!');
        return;
      }
      setError('');
      try {
        const data = await f.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Đọc dữ liệu từ hàng 8 (bỏ qua 7 dòng đầu, dòng 8 là header)
        const rows = XLSX.utils.sheet_to_json(sheet, { range: 7 });
        setTableData(rows);
      } catch {
        setError('Lỗi đọc file hoặc định dạng file không đúng!');
      }
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Xử lý khi nhấn nút tính toán
  const handleCalculate = async () => {
    if (!file) {
      setError('Vui lòng chọn file báo cáo (.xlsx)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { range: 7 });

      const start = startTime;
      const end = endTime;
      let sum = 0;
      rows.forEach(row => {
        const time = row['Giờ'];
        let value = row['Thành tiền (VNĐ)'];
        if (typeof value === 'string') {
          value = value.replace(/[^\d.-]/g, '');
        }
        if (time && value) {
          if (time >= start && time < end) {
            sum += Number(value);
          }
        }
      });
      setTotal(sum);
    } catch (err) {
      setError('Lỗi đọc file hoặc định dạng file không đúng!');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ width: '100%', maxWidth: '1000px', margin: '20px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <h2 style={{ textAlign: 'center' }}>Báo cáo doanh thu xăng dầu</h2>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          marginBottom: 16,
          padding: '32px 0',
          border: '2px dashed #1976d2',
          borderRadius: 8,
          textAlign: 'center',
          background: '#f5faff',
          color: '#1976d2',
          cursor: 'pointer',
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <strong>Kéo và thả file báo cáo (.xlsx) vào đây</strong>
        </div>
        <div style={{ fontSize: 13, color: '#555' }}>Hoặc chọn file bên dưới</div>
        {file && <div style={{ marginTop: 8, color: '#388e3c' }}>Đã chọn: {file.name}</div>}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Chọn file báo cáo (.xlsx): </label>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Giờ bắt đầu: </label>
        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
        <label style={{ marginLeft: 16 }}>Giờ kết thúc: </label>
        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
      </div>
      <button onClick={handleCalculate} disabled={loading} style={{ padding: '8px 24px', fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6 }}>
        {loading ? 'Đang tính...' : 'Tính tổng Thành tiền'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      {total !== null && !error && (
        <div style={{ marginTop: 24, fontSize: 20, fontWeight: 'bold', color: '#388e3c' }}>
          Tổng Thành tiền: {total.toLocaleString()} VND
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 12 }}>Dữ liệu đã đọc từ file</h3>
        <div style={{ maxHeight: 350, minHeight: 120, border: '1px solid #eee', borderRadius: 8, overflow: 'auto', background: '#fafcff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {tableData.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ background: '#f5faff', height: 40 }}>
                <tr>
                  {Object.keys(tableData[0]).map((key) => (
                    <th key={key} style={{ border: '1px solid #ddd', padding: '6px 8px', position: 'sticky', top: 0, background: '#f5faff', zIndex: 1 }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ marginTop: 10 }}>
                {tableData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.keys(tableData[0]).map((key) => (
                      <td key={key} style={{ border: '1px solid #eee', padding: '6px 8px', whiteSpace: 'nowrap' }}>{row[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span style={{ color: '#bbb', fontSize: 15 }}>Chưa có dữ liệu để hiển thị</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
