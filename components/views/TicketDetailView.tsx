
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Role, TicketStatus, IshikawaData } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import IshikawaDiagram from '../ticket/IshikawaDiagram';
import Comments from '../ticket/Comments';
import { analyzeTicketWithGemini } from '../../services/geminiService';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 9a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM9 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6H6a1 1 0 010-2h1V3a1 1 0 011-1zm5 4a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1V7a1 1 0 011-1z" clipRule="evenodd" /></svg>;

const TicketDetailView: React.FC<{ ticketId: string }> = ({ ticketId }) => {
    const { tickets, users, updateTicket, selectTicket, user } = useAuth();
    const ticket = tickets.find(t => t.id === ticketId);

    const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(ticket.geminiAnalysis || '');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSavingAnalysis, setIsSavingAnalysis] = useState(false);

    if (!ticket) {
        return <Card>Ticket no encontrado.</Card>;
    }

    const handleIshikawaUpdate = (newIshikawaData: IshikawaData) => {
        const updatedTicket = { id: ticket.id, ishikawaData: newIshikawaData };
        updateTicket(updatedTicket);
    };

    const handleAnalyzeClick = async () => {
        setAnalysisModalOpen(true);
        setIsAnalyzing(true);
        const result = await analyzeTicketWithGemini(ticket);
        setAnalysisResult(result);
        setIsAnalyzing(false);
    };

    const handleSaveAnalysis = async () => {
        setIsSavingAnalysis(true);
        await updateTicket({ id: ticket.id, geminiAnalysis: analysisResult });
        setIsSavingAnalysis(false);
    };

    const handleStatusChange = (newStatus: TicketStatus) => {
        updateTicket({ id: ticket.id, status: newStatus });
    };

    const canApprove = (user?.role === Role.JefeDirecto && ticket.status === TicketStatus.EnRevisionJefe && user.email === ticket.aprobadorEmail) ||
        (user?.role === Role.Administrador && ticket.status === TicketStatus.EnRevisionJefe);
    const canWorkOnTicket = user?.role === Role.MejoraContinua || user?.role === Role.Administrador;

    const solicitanteUser = users.find(u => u.id === ticket.solicitanteId);
    const asignadoUser = users.find(u => u.id === ticket.asignadoAId);

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <button onClick={() => selectTicket(null)} className="text-primary hover:text-accent mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h1 className="text-3xl font-bold text-primary">{ticket.title} <span className="text-gray-400 font-light">({ticket.id})</span></h1>
            </div>

            <Card>
                <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                        <Badge status={ticket.status} />
                        <p className="text-sm text-gray-500 mt-2">Creado el: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {canApprove && (
                            <>
                                <Button onClick={() => handleStatusChange(TicketStatus.Aprobado)} variant="success" size="sm">Aprobar</Button>
                                <Button onClick={() => handleStatusChange(TicketStatus.Rechazado)} variant="danger" size="sm">Rechazar</Button>
                            </>
                        )}
                        {canWorkOnTicket && ticket.status === TicketStatus.Aprobado && (
                            <Button onClick={() => handleStatusChange(TicketStatus.EnAnalisis)} variant="primary" size="sm">Iniciar Análisis</Button>
                        )}
                        {canWorkOnTicket && ticket.status === TicketStatus.EnAnalisis && (
                            <Button onClick={() => handleStatusChange(TicketStatus.EnDesarrollo)} variant="primary" size="sm">Iniciar Desarrollo</Button>
                        )}
                        {canWorkOnTicket && ticket.status === TicketStatus.EnDesarrollo && (
                            <Button onClick={() => handleStatusChange(TicketStatus.EnValidacion)} variant="primary" size="sm">Pasar a Validación</Button>
                        )}
                        {canWorkOnTicket && ticket.status === TicketStatus.EnValidacion && (
                            <Button onClick={() => handleStatusChange(TicketStatus.Implementado)} variant="success" size="sm">Marcar como Implementado</Button>
                        )}
                        {canWorkOnTicket && ticket.status === TicketStatus.Implementado && (
                            <Button onClick={() => handleStatusChange(TicketStatus.Cerrado)} variant="secondary" size="sm">Cerrar Ticket</Button>
                        )}

                        <Button onClick={handleAnalyzeClick} variant="accent" size="sm" disabled={isAnalyzing}>
                            <SparklesIcon /> {isAnalyzing ? 'Analizando...' : 'Analizar con Gemini AI'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div><strong>Solicitante:</strong> {solicitanteUser?.name || ticket.solicitanteId}</div>
                    <div><strong>Área:</strong> {ticket.area}</div>
                    <div><strong>Asignado a:</strong> {asignadoUser?.name || 'No asignado'}</div>
                    <div><strong>Categoría:</strong> {ticket.categoria}</div>
                    <div><strong>Urgencia:</strong> {ticket.urgencia}</div>
                    <div><strong>Prioridad:</strong> {ticket.prioridad}</div>
                </div>

                <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold text-base text-gray-800 mb-2">Descripción</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
                </div>
                <div className="mt-4">
                    <h3 className="font-semibold text-base text-gray-800 mb-2">Impacto Declarado</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{ticket.impacto}</p>
                </div>

                {ticket.geminiAnalysis && (
                    <div className="mt-6 border-t pt-4 bg-blue-50/30 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-base text-primary flex items-center">
                                <SparklesIcon /> Análisis de Gemini AI
                            </h3>
                            <Badge content="Guardado" variant="info" />
                        </div>
                        <div className="text-gray-700 text-sm prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: ticket.geminiAnalysis.replace(/\n/g, '<br />') }} />
                    </div>
                )}
            </Card>

            {canWorkOnTicket && <IshikawaDiagram data={ticket.ishikawaData} onUpdate={handleIshikawaUpdate} />}

            <Comments ticketId={ticket.id} />

            <Modal isOpen={isAnalysisModalOpen} onClose={() => setAnalysisModalOpen(false)} title="Análisis con IA de Gemini" size="xl">
                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-48">
                        <Spinner />
                        <p className="mt-4 text-gray-600">Analizando ticket con Inteligencia Artificial...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="prose max-w-none bg-slate-50 p-6 rounded-xl border border-slate-200" dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />') }} />
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="secondary" onClick={() => setAnalysisModalOpen(false)}>Cerrar</Button>
                            <Button variant="success" onClick={handleSaveAnalysis} disabled={isSavingAnalysis}>
                                {isSavingAnalysis ? 'Guardando...' : 'Guardar este Análisis en el Ticket'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TicketDetailView;
