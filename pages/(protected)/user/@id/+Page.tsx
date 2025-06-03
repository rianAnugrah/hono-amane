// pages/users/[id]/+Page.tsx
import { usePageContext } from 'vike-react/usePageContext';
import { useEffect, useState } from 'react';


type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  placement?: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export default function UserDetailPage() {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then(setUser);
  }, [id]);

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Detail</h1>
      <div className="space-y-2 text-lg">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Name:</strong> {user.name || '-'}</p>
        <p><strong>Role:</strong> {user.role || '-'}</p>
        <p><strong>Placement:</strong> {user.placement || '-'}</p>
        <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
