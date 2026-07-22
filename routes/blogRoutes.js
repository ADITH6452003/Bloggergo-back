const express = require('express')
const { getUserBlogs, getBlogById, createBlog, updateBlog, deleteBlog, getStats, searchBlogs, getAuthors } = require('../controllers/blogController')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/my', auth, getUserBlogs)
router.get('/search', searchBlogs)
router.get('/authors', getAuthors)
router.get('/stats', auth, getStats)
router.get('/:id', getBlogById)
router.post('/', auth, createBlog)
router.put('/:id', auth, updateBlog)
router.delete('/:id', auth, deleteBlog)

module.exports = router
