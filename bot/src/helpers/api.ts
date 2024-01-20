import { Router } from 'express'

const router: Router = Router()

// Define routes
router.use('/', async (req, res) => {
  console.log('Pong to your ping!')
  res.send({
    message: "Hello World!, I'm Karmabot!",
  })
})

export default router
