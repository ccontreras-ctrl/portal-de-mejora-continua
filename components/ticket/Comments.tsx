
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Comment } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface CommentsProps {
  ticketId: string;
}

const Comments: React.FC<CommentsProps> = ({ ticketId }) => {
  const { user, users, getComments, addComment } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const fetchedComments = await getComments(ticketId);
      setComments(fetchedComments);
      setLoading(false);
    };
    fetchComments();
  }, [ticketId, getComments]);

  useEffect(() => {
    if (!supabase) return;

    const commentSubscription = supabase
      .channel(`comments-for-${ticketId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `ticket_id=eq.${ticketId}`,
      }, (payload) => {
        const newCommentData = payload.new;
        // Ignore if it was already added optimistically (temp- prefix)
        setComments(current => {
          const alreadyExists = current.some(c =>
            c.content === newCommentData.content &&
            c.authorId === newCommentData.author_id &&
            c.id.startsWith('temp-')
          );
          if (alreadyExists) {
            // Replace the temp comment with the real one
            return current.map(c =>
              (c.id.startsWith('temp-') && c.content === newCommentData.content && c.authorId === newCommentData.author_id)
                ? {
                  id: newCommentData.id,
                  content: newCommentData.content,
                  createdAt: newCommentData.created_at,
                  ticketId: newCommentData.ticket_id,
                  authorId: newCommentData.author_id
                }
                : c
            );
          }
          return [...current, {
            id: newCommentData.id,
            content: newCommentData.content,
            createdAt: newCommentData.created_at,
            ticketId: newCommentData.ticket_id,
            authorId: newCommentData.author_id
          }];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(commentSubscription);
    };
  }, [ticketId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '' || !user) return;

    // Optimistic update: show comment immediately
    const tempComment: Comment = {
      id: `temp-${Date.now()}`,
      content: newComment,
      createdAt: new Date().toISOString(),
      ticketId: ticketId,
      authorId: user.id,
    };
    setComments(current => [...current, tempComment]);
    const commentText = newComment;
    setNewComment('');

    await addComment({
      content: commentText,
      ticketId: ticketId,
      authorId: user.id,
    });
  };

  const getAuthorName = (authorId: string) => {
    return users.find(u => u.id === authorId)?.name.split(' ').map(n => n[0]).join('') || '??';
  }
  const getAuthorEmail = (authorId: string) => {
    return users.find(u => u.id === authorId)?.email.split('@')[0] || 'usuario';
  }


  return (
    <Card title="Comentarios y Bitácora">
      <div className="space-y-4 mb-6">
        {loading && <p>Cargando comentarios...</p>}
        {!loading && comments.length === 0 && <p className="text-sm text-gray-500">No hay comentarios todavía.</p>}

        {comments.map(comment => (
          <div key={comment.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600">{getAuthorName(comment.authorId)}</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-800">{comment.content}</p>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span>{getAuthorEmail(comment.authorId)}</span> &middot; <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 border-t pt-4">
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Añadir un comentario..."
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        ></textarea>
        <div className="mt-2 flex justify-end">
          <Button type="submit" size="sm" disabled={!newComment.trim()}>Comentar</Button>
        </div>
      </form>
    </Card>
  );
};

export default Comments;
