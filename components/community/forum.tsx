"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, ThumbsUp, Pin, Search, Plus, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"
import type { ForumPost } from "@/lib/community-data"
import { getAuthorRoleColor } from "@/lib/community-data"

interface ForumProps {
  posts: ForumPost[]
  onCreatePost: (post: Omit<ForumPost, "id" | "createdAt" | "updatedAt">) => void
  onLikePost: (postId: string) => void
}

/**
 * Community Forum Component
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Implement real-time post updates with WebSocket
 * - Add moderation tools and content filtering
 * - Implement user reputation and trust scoring
 * - Add advanced search with full-text indexing
 * - Implement post threading and nested replies
 * - Add notification system for post interactions
 * - Consider implementing post categories and tagging
 * - Add spam detection and automated moderation
 */
export function Forum({ posts, onCreatePost, onLikePost }: ForumProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general" as ForumPost["category"],
    tags: [] as string[],
  })

  const categories = ["all", "general", "suggestion", "complaint", "announcement", "question"]

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likes - a.likes
        case "replies":
          return b.replies - a.replies
        case "recent":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const pinnedPosts = filteredPosts.filter((post) => post.isPinned)
  const regularPosts = filteredPosts.filter((post) => !post.isPinned)

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getCategoryIcon = (category: ForumPost["category"]) => {
    const icons = {
      general: <MessageSquare className="h-4 w-4" />,
      suggestion: <TrendingUp className="h-4 w-4" />,
      complaint: <AlertCircle className="h-4 w-4" />,
      announcement: <Pin className="h-4 w-4" />,
      question: <MessageSquare className="h-4 w-4" />,
    }
    return icons[category]
  }

  const getCategoryColor = (category: ForumPost["category"]) => {
    const colors = {
      general: "bg-gray-100 text-gray-800",
      suggestion: "bg-blue-100 text-blue-800",
      complaint: "bg-red-100 text-red-800",
      announcement: "bg-green-100 text-green-800",
      question: "bg-purple-100 text-purple-800",
    }
    return colors[category]
  }

  const handleCreatePost = () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      onCreatePost({
        ...newPost,
        author: "Current User", // Replace with actual user
        authorRole: "citizen",
        likes: 0,
        replies: 0,
        isPinned: false,
        priority: "medium",
      })
      setNewPost({ title: "", content: "", category: "general", tags: [] })
      setShowCreatePost(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Forum</h2>
          <p className="text-muted-foreground">Share ideas, ask questions, and engage with your community</p>
        </div>
        <Button onClick={() => setShowCreatePost(!showCreatePost)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Create Post Form */}
      {showCreatePost && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={4}
            />
            <div className="flex gap-4">
              <Select
                value={newPost.category}
                onValueChange={(value) => setNewPost({ ...newPost, category: value as ForumPost["category"] })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Discussion</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={handleCreatePost}>Post</Button>
                <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="suggestion">Suggestions</SelectItem>
            <SelectItem value="complaint">Complaints</SelectItem>
            <SelectItem value="announcement">Announcements</SelectItem>
            <SelectItem value="question">Questions</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="replies">Most Replies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pinned Posts */}
      {pinnedPosts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Pin className="h-4 w-4" />
            Pinned Posts
          </h3>
          {pinnedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLikePost}
              formatTimeAgo={formatTimeAgo}
              getCategoryIcon={getCategoryIcon}
              getCategoryColor={getCategoryColor}
              isPinned
            />
          ))}
          <Separator />
        </div>
      )}

      {/* Regular Posts */}
      <div className="space-y-4">
        {regularPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={onLikePost}
            formatTimeAgo={formatTimeAgo}
            getCategoryIcon={getCategoryIcon}
            getCategoryColor={getCategoryColor}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filters."
                : "Be the first to start a discussion!"}
            </p>
            <Button onClick={() => setShowCreatePost(true)}>Create First Post</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface PostCardProps {
  post: ForumPost
  onLike: (postId: string) => void
  formatTimeAgo: (date: Date) => string
  getCategoryIcon: (category: ForumPost["category"]) => React.ReactNode
  getCategoryColor: (category: ForumPost["category"]) => string
  isPinned?: boolean
}

function PostCard({ post, onLike, formatTimeAgo, getCategoryIcon, getCategoryColor, isPinned }: PostCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${isPinned ? "border-primary/50 bg-primary/5" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{post.author}</span>
                  <Badge className={getAuthorRoleColor(post.authorRole)}>{post.authorRole}</Badge>
                  <span>•</span>
                  <span>{formatTimeAgo(post.createdAt)}</span>
                  {isPinned && (
                    <>
                      <span>•</span>
                      <Pin className="h-3 w-3" />
                      <span>Pinned</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(post.category)}>
                  {getCategoryIcon(post.category)}
                  <span className="ml-1 capitalize">{post.category}</span>
                </Badge>
                {post.isResolved !== undefined && (
                  <Badge variant={post.isResolved ? "default" : "secondary"}>
                    {post.isResolved ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {post.isResolved ? "Resolved" : "Open"}
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-muted-foreground mb-3 line-clamp-3">{post.content}</p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLike(post.id)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {post.replies} replies
                </Button>
              </div>

              <Button variant="outline" size="sm">
                View Discussion
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
