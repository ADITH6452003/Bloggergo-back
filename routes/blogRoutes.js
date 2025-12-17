const express = require('express')
const { getUserBlogs, createBlog, updateBlog, deleteBlog, getStats, searchBlogs, getAuthors } = require('../controllers/blogController')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/my', auth, getUserBlogs)
router.get('/search', searchBlogs)
router.get('/authors', getAuthors)
router.post('/', auth, createBlog)
router.put('/:id', auth, updateBlog)
router.delete('/:id', auth, deleteBlog)
router.get('/stats', auth, getStats)

module.exports = router