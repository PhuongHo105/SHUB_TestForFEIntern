import React, { useState } from 'react'
import * as yup from 'yup';
import './App.css'
import Input from '../../components/Input/Input.jsx'
import Button from '../../components/Button/Button'
import Combobox from '../../components/Combobox/Combobox.jsx';

export default function App() {
    const [soLuong, setSoLuong] = useState(0);
    const [donGia, setDonGia] = useState(0);
    const [thoiGian, setThoiGian] = useState(new Date().toISOString().slice(0, 19));
    const [tru, setTru] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const doanhThu = soLuong * donGia;

    const schema = yup.object().shape({
        thoiGian: yup.string().required('Vui lòng chọn thời gian'),
        soLuong: yup.number().min(1, 'Số lượng phải lớn hơn 0').required('Vui lòng nhập số lượng'),
        donGia: yup.number().min(1, 'Đơn giá phải lớn hơn 0').required('Vui lòng nhập đơn giá'),
        tru: yup.string().required('Vui lòng chọn trụ'),
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await schema.validate({ thoiGian, soLuong, donGia, tru });
            setSuccess('Cập nhật thành công!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleUpdate}>
            <div className="container">
                <div className='header'>
                    <div style={{ color: 'black', }} >
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H3.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.498.498 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L3.707 7.5H14.5A.5.5 0 0 1 15 8z" />
                            </svg>
                            <label style={{ cursor: 'pointer' }}>Đóng</label>
                        </div>
                        <h2>Nhập giao dịch</h2>
                    </div>
                    <Button text="Cập nhật" />

                </div>
                <div>
                    <Input type="datetime-local" name="Thời gian" value={thoiGian} onChange={e => setThoiGian(e.target.value)} />
                    <Input type="number" name="Số lượng" value={soLuong} onChange={e => setSoLuong(Number(e.target.value))} />
                    <Combobox options={[{ value: 'T1', label: 'T1' },
                    { value: 'T2', label: 'T2' },
                    { value: 'T3', label: 'T3' }]}
                        name={"Trụ"}
                        value={tru}
                        onChange={e => setTru(e.target.value)} />
                    <Input type="number" name="Doanh thu" value={doanhThu} readOnly />
                    <Input type="number" name="Đơn giá" value={donGia} onChange={e => setDonGia(Number(e.target.value))} />
                </div>
                {error && <div style={{ fontWeight: 'bold', color: 'red', marginTop: '10px' }}>{error}</div>}
                {success && <div style={{ fontWeight: 'bold', color: 'green', marginTop: '10px' }}>{success}</div>}
            </div>
        </form>
    )
}
