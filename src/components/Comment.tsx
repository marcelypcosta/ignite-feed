// Libs
import { Trash, ThumbsUp } from "@phosphor-icons/react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

// Components
import { Avatar } from "./Avatar";

// Style
import styles from "./Comment.module.css";

// Hooks
import { useState } from "react";

interface IComment {
  content: string;
  onDeleteComment: (comment: string) => void;
  authorName: string;
  createdAt?: Date;
}

export function Comment({ content, onDeleteComment, authorName, createdAt }: IComment) {
  const [likeCount, setLikeCount] = useState(0);

  function handleDeleteComment() {
    onDeleteComment(content);
  }

  function handleLikeCount() {
    // Maneira simples mas não recomendada
    // setLikeCount(likeCount + 1)

    // Maneira correta de se atualizar uma variável que depende de seu valor anterior!
    setLikeCount((like) => {
      return like + 1;
    });
  }

  // Formatting date published
  const baseDate = createdAt ?? new Date();
  const publishedDateFormatted = format(
    baseDate,
    "dd 'de' MMM 'ás' HH:mm'h'",
    {
      locale: ptBR,
    }
  );

  const publishedDateRelativeToNow = formatDistanceToNow(baseDate, {
    locale: ptBR,
    addSuffix: true,
  });

  return (
    <div className={styles.comment}>
      <Avatar src={"https://github.com/marcelypcosta.png"} />
      <div className={styles.box}>
        <div className={styles.content}>
          <header className={styles.authorAndTime}>
            <div className={styles.authorInfo}>
              <strong>{authorName}</strong>
              <time
                title={publishedDateFormatted}
                dateTime={baseDate.toISOString()}
              >
                {publishedDateRelativeToNow}
              </time>
            </div>
            <button
              onClick={handleDeleteComment}
              className={styles.buttonTrash}
              title="Deletar comentário"
            >
              <Trash size={24} />
            </button>
          </header>

          <p className={styles.contentComment}>{content}</p>
        </div>

        <footer>
          <button
            className={styles.buttonThumbsUp}
            title="Aplaudir comentário"
            onClick={handleLikeCount}
          >
            <ThumbsUp size={20} /> Aplaudir <span>{likeCount}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
