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
  useEffect,
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

interface ICommentItem {
  content: string;
  createdAt: string;
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
  const storageKey = `ignite-feed:post:${post.id}:comments`;
  const [comment, setComment] = useState<ICommentItem[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      const normalized: ICommentItem[] = Array.isArray(parsed)
        ? parsed.map((x: any) =>
            typeof x === "string"
              ? { content: x, createdAt: new Date().toISOString() }
              : x
          )
        : [];
      return normalized;
    } catch {
      return [];
    }
  });
  const [newCommentChange, setNewCommentChange] = useState("");

  // Persistir comentários no localStorage sempre que mudarem
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(comment));
    } catch {
      // noop
    }
  }, [comment, storageKey]);

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

    // Add os novos comentários a lista com timestamp
    const newItem: ICommentItem = { content: newCommentChange, createdAt: new Date().toISOString() };
    setComment([...comment, newItem]);
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
    const updateCommentList = comment.filter((item) => {
      return item.content !== commentToDelete;
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
        {comment.map((item, index) => {
          const createdAtDate = new Date(item.createdAt);
          return (
            <Comment
              key={`${item.content}-${index}-${item.createdAt}`}
              content={item.content}
              onDeleteComment={deleteComment}
              authorName={post.author.name}
              createdAt={createdAtDate}
            />
          );
        })}
      </div>
    </article>
  );
}
