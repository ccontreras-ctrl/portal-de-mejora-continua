
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { TicketStatus } from '../../types';

const CreateTicket: React.FC = () => {
    const { user, addTicket, setPage } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [impacto, setImpacto] = useState('');
    const [urgencia, setUrgencia] = useState<'Baja' | 'Media' | 'Alta'>('Media');
    const [categoria, setCategoria] = useState('Proceso Interno');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        const newTicket = {
            title,
            description,
            impacto,
            urgencia,
            categoria,
            solicitanteId: user.id,
            area: user.area || 'Sin Área',
            sucursal: user.sucursal || 'Sin Sucursal',
            prioridad: urgencia, // Simple mapping for now
            status: TicketStatus.EnRevisionJefe,
            aprobadorEmail: user.manager || 'ccontreras@suzuval.cl',
            driveFolderUrl: '#',
            ishikawaData: {
                categories: { 'Método': [], 'Mano de obra': [], 'Máquina': [], 'Material': [], 'Medio ambiente': [], 'Medición': [] }
            }
        };
        await addTicket(newTicket, file);
        setLoading(false);
        setPage('dashboard');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <Card title="Crear Nuevo Ticket de Mejora Continua">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título del Ticket</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción del Problema/Oportunidad</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                </div>
                <div>
                    <label htmlFor="impacto" className="block text-sm font-medium text-gray-700">Impacto (ej: ahorro de tiempo, reducción de costos, etc.)</label>
                    <textarea id="impacto" value={impacto} onChange={e => setImpacto(e.target.value)} required rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="urgencia" className="block text-sm font-medium text-gray-700">Urgencia</label>
                        <select id="urgencia" value={urgencia} onChange={e => setUrgencia(e.target.value as any)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            <option>Baja</option>
                            <option>Media</option>
                            <option>Alta</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select id="categoria" value={categoria} onChange={e => setCategoria(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            <option>Proceso Interno</option>
                            <option>Operacional</option>
                            <option>BI / Reportería</option>
                            <option>Comercial</option>
                            <option>Administrativo</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Adjuntar Archivos</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {file ? (
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium text-primary">Archivo seleccionado:</p>
                                    <p>{file.name}</p>
                                    <button onClick={() => setFile(null)} className="mt-2 text-red-500 hover:text-red-700 underline">Quitar archivo</button>
                                </div>
                            ) : (
                                <>
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                            <span>Subir un archivo</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">o arrastrar y soltar</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, PDF hasta 10MB</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={() => setPage('dashboard')} disabled={loading}>Cancelar</Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? (file ? 'Subiendo archivo...' : 'Enviando...') : 'Enviar para Aprobación'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default CreateTicket;
