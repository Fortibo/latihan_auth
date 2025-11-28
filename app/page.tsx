import Layout from "./components/Layout";
import PostList from "./components/PostList";

export default function HomePage() {
  return (
    <Layout>
      <h1>All Posts</h1>
      <PostList />
    </Layout>
  );
}
