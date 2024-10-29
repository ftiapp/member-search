'use client';
import React from 'react';
import { Member} from './type'; // Adjust path as per your project structure
import MemberComponent from './member'; // Import MemberComponent

interface MemberListProps {
  members: Member[];
  language: 'TH' | 'EN';
  onMemberClick: (member: Member) => void; // เพิ่ม onMemberClick prop
}

const MemberList: React.FC<MemberListProps> = ({ members, language, onMemberClick }) => {
  // ลบสมาชิกที่มี MEMBER_CODE ซ้ำกัน
  const uniqueMembers = members.filter(
    (member, index, self) =>
      index === self.findIndex((m) => m.MEMBER_CODE === member.MEMBER_CODE)
  );

  console.log('Unique members to display:', uniqueMembers); // ตรวจสอบสมาชิกที่ไม่มีการซ้ำ

  return (
    <div className="member-container">
      {uniqueMembers.map((member) => (
        <MemberComponent 
          key={member.MEMBER_CODE} 
          member={member} 
          language={language} 
          onClick={() => onMemberClick(member)} 
        />
      ))}
    </div>
  );
};

export default MemberList;