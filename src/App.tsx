// Components
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Post, IPost } from "./components/Post";

// Styles
import "./global.css";
import styles from "./App.module.css";
import postStyles from "./components/Post.module.css";

// Hooks
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";

const defaultPosts: IPost[] = [
  {
    id: 1,
    author: {
      avatarUrl: "http://github.com/diego3g.png",
      name: "Diego Fernandes",
      role: "Web Developer",
    },
    content: [
      { type: "paragraph", content: "Fala galeraa 👋" },
      {
        type: "paragraph",
        content:
          "Acabei de subir mais um projeto no meu portifa. É um projeto que fiz no NLW Return, evento da Rocketseat. O nome do projeto é DoctorCare 🚀",
      },
      { type: "link", content: "👉 jane.design/doctorcare" },
    ],
    publishedAt: new Date("2025-09-14 14:30:00"),
  },
];

export default function App() {
  // Lista de posts com persistência em localStorage
  const [posts, setPosts] = useState<IPost[]>(() => {
    try {
      const stored = localStorage.getItem("ignite-feed:posts");
      if (stored) {
        const parsed = JSON.parse(stored) as Array<{
          id: number;
          author: { avatarUrl: string; name: string; role: string };
          content: { type: "paragraph" | "link"; content: string }[];
          publishedAt: string;
        }>;
        return parsed.map((p) => ({
          ...p,
          publishedAt: new Date(p.publishedAt),
        }));
      }
    } catch {
      // noop
    }
    return defaultPosts;
  });

  useEffect(() => {
    try {
      localStorage.setItem("ignite-feed:posts", JSON.stringify(posts));
    } catch {
      // noop
    }
  }, [posts]);

  // Formulário para criar novo post
  const [newPostContent, setNewPostContent] = useState("");

  function handleCreateNewPost(event: FormEvent) {
    event.preventDefault();

    const lines = newPostContent
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedContent: IPost["content"] = lines.map((line) => {
      const isUrl = /^(https?:\/\/|www\.)/i.test(line);
      return { type: isUrl ? "link" : "paragraph", content: line };
    });

    const newPost: IPost = {
      id: Date.now(),
      author: {
        avatarUrl: "https://github.com/marcelypcosta.png",
        name: "Marcely Costa",
        role: "Dev Front-End",
      },
      content: parsedContent,
      publishedAt: new Date(),
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
  }

  function handleNewPostChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setNewPostContent(event.target.value);
  }

  const isNewPostEmpty = newPostContent.trim().length === 0;

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <Sidebar />
        <main>
          {/* Formulário de criação de post seguindo o design */}
          <article className={postStyles.post}>
            <form onSubmit={handleCreateNewPost} className={postStyles.comments}>
              <strong>Crie um novo post</strong>

              <textarea
                name="newPost"
                placeholder="Escreva seu post"
                value={newPostContent}
                onChange={handleNewPostChange}
                required
              />

              <footer>
                <button type="submit" disabled={isNewPostEmpty}>
                  Publicar
                </button>
              </footer>
            </form>
          </article>

          {posts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
        </main>
      </div>
    </>
  );
}
