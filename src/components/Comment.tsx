// Libs
import { Trash, ThumbsUp } from "@phosphor-icons/react";

// Components
import { Avatar } from "./Avatar";

// Style
import styles from "./Comment.module.css";

// Hooks
import { useState } from "react";

interface IComment {
  content: string;
  onDeleteComment: (comment: string) => void;
}

export function Comment({ content, onDeleteComment }: IComment) {
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

  return (
    <div className={styles.comment}>
      <Avatar src={"https://github.com/diego3g.png"}/>
      <div className={styles.box}>
        <div className={styles.content}>
          <header className={styles.authorAndTime}>
            <div className={styles.authorInfo}>
              <strong>Diego Fernandes</strong>
              <time
                title="14 de Outubro ás 15h15"
                dateTime="2024-10-14 15:15:30"
              >
                Cerca de 1h atrás
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
