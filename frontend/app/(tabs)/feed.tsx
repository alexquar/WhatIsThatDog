import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
type Post = {
  date: Date;
  description: string;
  dog_name: string;
  dog_breed: string;
  location: string;
  _id: string;
  file: string;
  likes: number;
};

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBreed, setSelectedBreed] = useState<string>("labrador");
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://backend-54803426778.northamerica-northeast2.run.app/posts");
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const sortedPosts: Post[] = (data["posts"] || []).sort(
        (a: Post, b: Post) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!postId) {
      Alert.alert("Error", "Invalid post ID");
      return;
    }
    try {
      const response = await fetch(`https://backend-54803426778.northamerica-northeast2.run.app/post/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const res = await response.json();
      if (!res.success) throw new Error("Failed to like post");
      console.log("Post liked:", res);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
      Alert.alert(
        "Error",
        "Failed to like that fuzzy friend. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchPosts} />
        }
        style={styles.spacer}
      >
        <View style={styles.headerContainer}>
          <Image
            style={styles.logo}
            source={require("../../assets/images/logo.png")}
            resizeMode="contain"
          />
          <Text style={styles.header}>"What's That Dog?!" Friend Feed</Text>
        </View>
        <View
          style={{
            marginVertical: 15,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#040909",
              marginBottom: 20,
              lineHeight: 22,
              textAlign: "justify",
            }}
          >
            Here, you can explore posts shared by fellow dog lovers. Each post
            features adorable dogs, their breeds, and locations where they were
            spotted. Enjoy browsing through the latest updates and feel free to
            share your own dog sightings! Posts are anonymous, so please respectful.
          </Text>
        </View>
        <View>
          {posts.length > 0 ? (
            
            posts.map((post) => (
              <View key={post._id} style={styles.postCard}>
                <View style={styles.postContent}>
                  <Text style={styles.postTitle}>
                    {post.dog_name}{" "}
                    <Text style={styles.postBreed}>({post.dog_breed})</Text>
                  </Text>
                  <Text style={styles.postLocation}>
                    📍 {post.location} —{" "}
                    {new Date(post.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.postDescription}>{post.description}</Text>
                </View>
                <View style={{ position: "relative" }}>
                  {loading ? (
                  <View style={[styles.postImage, styles.loadingContainer]}>
                    <ActivityIndicator size="large" color="#8492c1" />
                  </View>
                  ) : (
                  <>
                    <Image
                    source={
                      post?.file
                      ? { uri: post.file }
                      : require("../../assets/images/logo.png")
                    }
                    style={styles.postImage}
                    resizeMode="cover"
                    />
                    <TouchableOpacity
                    onPress={() => handleLikePost(post._id)}
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 10,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      padding: 8,
                      borderRadius: 20,
                    }}
                    >
                    <Text style={styles.postLikes}>❤️ {post.likes}</Text>
                    </TouchableOpacity>
                  </>
                  )}
                </View>
              </View>
            ))
          )
           : (
            <View>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 18,
                  color: "#666",
                }}
              >
                No posts available. Please check back later!
              </Text>
            </View>
          )}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ by Dog Lovers for Dog Lovers
          </Text>
          <Text style={styles.footerText}>© 2025 What's That Dog?!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfdfd",
    padding: 10,
  },
  spacer: {
    margin: 20,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8492c1",
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#5fadae",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  postCard: {
    backgroundColor: "#e6f3f7",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: "100%",
    height: 200,
  },
  postContent: {
    padding: 15,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  postBreed: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#8492c1",
  },
  postLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  postDescription: {
    fontSize: 15,
    color: "#444",
    marginBottom: 10,
    lineHeight: 20,
  },
  postLikes: {
    fontSize: 14,
    color: "red",
    fontWeight: "600",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#040909",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f3f7',
  },
});

export default Feed;
