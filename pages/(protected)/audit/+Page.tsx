import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { File, PlusCircle } from 'lucide-react';

type ProjectCode = {
  id: number;
  code: string;
};

export default function ProjectCodesPage() {
  const [projectCodes, setProjectCodes] = useState<ProjectCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editCode, setEditCode] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const fetchProjectCodes = async () => {
    const res = await axios.get('/api/project-codes', {
      params: { search, sortBy, order },
    });
    setProjectCodes(res.data);
  };

  useEffect(() => {
    fetchProjectCodes();
  }, [search, sortBy, order]);

  const handleCreate = async () => {
    if (!newCode.trim()) return;
    await axios.post('/api/project-codes', { code: newCode });
    setNewCode('');
    fetchProjectCodes();
  };

  const handleUpdate = async (id: number) => {
    if (!editCode.trim()) return;
    await axios.put(`/api/project-codes/${id}`, { code: editCode });
    setEditId(null);
    setEditCode('');
    fetchProjectCodes();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/project-codes/${id}`);
    fetchProjectCodes();
  };

  return (
    <div className="p-6 w-full mx-auto">
        <div className='w-full flex gap-4 justify-between items-center'>

      <h1 className="text-2xl font-bold mb-4">Audit</h1>

      <div className='grid grid-cols-2 gap-2'>
        <button className='btn'><PlusCircle />New Inspection</button>
        <button className='btn'><File /> Report</button>
      </div>
        </div>

     

        {/* Table audit history */}
        <div className='w-full h-6 flex border border-gray-700'>
            <div>No</div>
            <div>Date</div>
            <div>Asset number</div>
            <div>Asset name</div>
            <div>Condition</div>
            <div>Asset Type</div>
            <div>Status</div>
            <div>Action</div>

        </div>
    </div>
  );
}
