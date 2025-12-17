const Blog = require('../models/Blog')

const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.userId }).sort({ createdAt: -1 })
    res.json(blogs)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const searchBlogs = async (req, res) => {
  try {
    const { query } = req.query
    const User = require('../models/User')
    
    // Find users by username
    const users = await User.find({ 
      username: { $regex: query, $options: 'i' } 
    }).select('_id username')
    
    if (users.length === 0) {
      return res.json([])
    }
    
    // Find blogs by these users
    const userIds = users.map(user => user._id)
    const blogs = await Blog.find({ author: { $in: userIds } })
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
    
    res.json(blogs)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body
    const blog = new Blog({
      title,
      content,
      author: req.userId
    })
    
    await blog.save()
    res.status(201).json(blog)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { title, content, lastUpdated: new Date() },
      { new: true }
    )
    
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json(blog)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.userId })
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json({ message: 'Blog deleted' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getStats = async (req, res) => {
  try {
    const userBlogCount = await Blog.countDocuments({ author: req.userId })
    const totalBlogs = await Blog.countDocuments()
    
    res.json({
      userBlogs: userBlogCount,
      totalBlogs
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getAuthors = async (req, res) => {
  try {
    const User = require('../models/User')
    
    // Get all blogs with author info, then group by author
    const blogsWithAuthors = await Blog.find()
      .populate('author', 'username dob')
      .sort({ createdAt: -1 })
    
    // Group blogs by author and get latest blog date
    const authorMap = new Map()
    
    blogsWithAuthors.forEach(blog => {
      if (blog.author) {
        const authorId = blog.author._id.toString()
        if (!authorMap.has(authorId)) {
          authorMap.set(authorId, {
            username: blog.author.username,
            dob: blog.author.dob,
            latestBlogDate: blog.createdAt,
            blogCount: 1
          })
        } else {
          const existing = authorMap.get(authorId)
          existing.blogCount += 1
          if (blog.createdAt > existing.latestBlogDate) {
            existing.latestBlogDate = blog.createdAt
          }
        }
      }
    })
    
    // Convert to array and sort by latest blog date
    const authorsArray = Array.from(authorMap.values())
      .sort((a, b) => new Date(b.latestBlogDate) - new Date(a.latestBlogDate))
      .slice(0, 5)
    
    // Calculate ages
    const authorsWithAge = authorsArray.map(author => {
      let age = null
      if (author.dob) {
        const birthDate = new Date(author.dob)
        const today = new Date()
        age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
      }
      
      return {
        username: author.username,
        age: age,
        latestBlogDate: author.latestBlogDate,
        blogCount: author.blogCount
      }
    })
    
    res.json(authorsWithAge)
  } catch (error) {
    console.error('Authors endpoint error:', error)
    res.status(400).json({ message: error.message })
  }
}

module.exports = { getUserBlogs, createBlog, updateBlog, deleteBlog, getStats, searchBlogs, getAuthors }