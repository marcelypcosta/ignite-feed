// Libs
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

// Component
import { Avatar } from "./Avatar";
import { Comment } from "./Comment";

// Style
import styles from "./Post.module.css";

// Hooks
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type InvalidEvent,
} from "react";

// Interface das props

interface IAuthor {
  avatarUrl: string;
  name: string;
  role: string;
}

interface IContent {
  type: "paragraph" | "link";
  content: string;
}

export interface IPost {
  id: number;
  author: IAuthor;
  content: IContent[];
  publishedAt: Date;
}

interface IPostProps {
  post: IPost;
}

export function Post({ post }: IPostProps) {
  // States
  const [comment, setComment] = useState<string[]>([]);
  const [newCommentChange, setNewCommentChange] = useState("");

  // Formatting date published
  const publishedDateFormatted = format(
    post.publishedAt,
    "dd 'de' MMM 'ás' HH:mm'h'",
    {
      locale: ptBR,
    }
  );

  const publishedDateRelativeToNow = formatDistanceToNow(post.publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  // onSubmit event
  function handleCreateNewComment(event: FormEvent) {
    event.preventDefault();

    // Add os novos comentários a lista
    setComment([...comment, newCommentChange]);
    // Limpar o input
    setNewCommentChange("");
  }

  // onChange event
  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("");
    setNewCommentChange(event.target.value);
  }

  // Validation
  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("Este campo é obrigatório");
  }

  function deleteComment(commentToDelete: string) {
    // Filtra os comentários, retornando apenas os que são diferentes do comentário a ser deletado
    const updateCommentList = comment.filter((comment) => {
      return comment !== commentToDelete;
    });

    // Atualiza o estado com a nova lista de comentários
    setComment(updateCommentList);
  }

  const isNewCommentEmpty = newCommentChange.length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar hasBorder src={post.author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{post.author.name}</strong>
            <span>{post.author.role}</span>
          </div>
        </div>

        <time
          title={publishedDateFormatted}
          dateTime={post.publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
        {post.content.map((line) => {
          if (line.type === "paragraph") {
            return <p key={line.content}>{line.content}</p>;
          } else if (line.type === "link") {
            return (
              <p key={line.content}>
                <a href="#">{line.content}</a>
              </p>
            );
          }
        })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.comments}>
        <strong>Deixe seu feedback</strong>

        <textarea
          name="comment"
          placeholder="Deixe seu comentário"
          value={newCommentChange}
          onChange={handleNewCommentChange}
          onInvalid={handleNewCommentInvalid}
          required
        />

        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comment.map((comment) => {
          return (
            <Comment
              key={comment}
              content={comment}
              onDeleteComment={deleteComment}
            />
          );
        })}
      </div>
    </article>
  );
}
