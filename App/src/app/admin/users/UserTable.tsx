'use client'

import { useState } from 'react'
import { updateUserRole, updateUserLevel, deleteUser } from '@/app/actions/admin'
import { Trash2, Shield, User, Award, Check } from 'lucide-react'

export default function UserTable({ users }: { users: any[] }) {
    const [loading, setLoading] = useState<string | null>(null)

    const handleRoleChange = async (userId: string, newRole: string) => {
        setLoading(userId)
        try {
            await updateUserRole(userId, newRole)
        } catch (e) {
            alert('Fehler: ' + e)
        } finally {
            setLoading(null)
        }
    }

    const handleLevelChange = async (userId: string, newLevel: number) => {
        setLoading(userId)
        try {
            await updateUserLevel(userId, newLevel)
        } catch (e) {
            alert('Fehler: ' + e)
        } finally {
            setLoading(null)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm('Sicher? Der User wird unwiderruflich gelöscht.')) return
        setLoading(userId)
        try {
            await deleteUser(userId)
        } catch (e) {
            alert('Fehler: ' + e)
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                        <th className="p-4 font-bold text-zinc-500 text-sm">User ID / Email</th>
                        <th className="p-4 font-bold text-zinc-500 text-sm">Rolle</th>
                        <th className="p-4 font-bold text-zinc-500 text-sm">Level</th>
                        <th className="p-4 font-bold text-zinc-500 text-sm">Aktionen</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-zinc-900 dark:text-zinc-100">{user.email || 'Keine Email (Sync pending)'}</div>
                                <div className="font-mono text-xs text-zinc-400 mb-1">{user.id}</div>
                                <div className="flex items-center gap-2 text-xs">
                                    {user.role === 'admin' ? <Shield className="w-3 h-3 text-indigo-500" /> : <User className="w-3 h-3 text-zinc-400" />}
                                    <span className="capitalize">{user.role || 'user'}</span>
                                </div>
                            </td>
                            <td className="p-4">
                                <select
                                    value={user.role || 'user'}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    disabled={loading === user.id}
                                    className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm p-2 cursor-pointer"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="moderator">Content Manager</option>
                                </select>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 w-fit">
                                    <Award className="w-4 h-4 text-amber-500 ml-2" />
                                    <input
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={user.level || 1}
                                        onChange={(e) => handleLevelChange(user.id, parseInt(e.target.value))}
                                        disabled={loading === user.id}
                                        className="w-12 bg-transparent border-none text-center font-bold text-sm"
                                    />
                                </div>
                            </td>
                            <td className="p-4">
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    disabled={loading === user.id}
                                    className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                    title="User löschen"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {loading === user.id && <span className="text-xs text-zinc-400 ml-2">Loading...</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
