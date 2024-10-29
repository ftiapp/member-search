'use client';
import React, { useEffect, useState } from 'react';
import { Member } from '../pages/type'; // นำเข้า interface Member ที่คุณได้สร้างไว้
import axios from 'axios'; // หากต้องการใช้ axios สำหรับการ fetch ข้อมูล

const StatFTI: React.FC = () => {
    const [memberCounts, setMemberCounts] = useState<{ [key: string]: number }>({
        '11': 0,
        '21': 0,
        '12': 0,
        '22': 0,
    });

    useEffect(() => {
        fetchMemberCounts(); // เรียกใช้ฟังก์ชันเมื่อ component โหลด

        async function fetchMemberCounts() {
            try {
                const response = await axios.get('/api/members'); // เปลี่ยนเส้นทาง API ตามที่คุณได้สร้างไว้
                const members: Member[] = response.data; // สมมุติว่า API คืนข้อมูลเป็น array ของ Member

                const counts: { [key: string]: number } = {
                    '11': 0,
                    '21': 0,
                    '12': 0,
                    '22': 0,
                };

                members.forEach(member => {
                    if (member.MEMBER_TYPE_CODE in counts) {
                        counts[member.MEMBER_TYPE_CODE]++;
                    }
                });

                setMemberCounts(counts);
            } catch (error) {
                console.error('Error fetching member counts:', error);
                // Handle error (e.g., show error message)
            }
        }
    }, []);

    return (
        <div>
            <h2>สรุปจำนวนสมาชิกประเภทของสภาอุตสาหกรรมแห่งประเทศไทย (สถานะ Active)</h2>
            <table>
                <thead>
                    <tr>
                        <th>ประเภทสมาชิก</th>
                        <th>จำนวน</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(memberCounts).map(([typeCode, count]) => (
                        <tr key={typeCode}>
                            <td>{typeCode}</td>
                            <td>{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StatFTI;