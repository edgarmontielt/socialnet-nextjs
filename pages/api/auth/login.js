// import { prisma } from '../../../libs/db'
// const client = prisma

import { PrismaClient } from '@prisma/client';
const client = new PrismaClient()

export default async function login(req, res) {
    if (req.method === 'POST') {

        const user = await client.user.findFirst({
            where: {
                idProvider: req.body.idProvider,
                provider: req.body.provider,
            }
        })

        if (user) return res.json(user)

        try {
            const newUser = await client.user.create({
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    idProvider: req.body.idProvider,
                    background: undefined,
                    provider: req.body.provider,
                    profilePic: req.body.profilePic,
                    posts: undefined,
                    comments: undefined,
                    likes: undefined,
                    likesPostsIDs: undefined,
                    friends: undefined,
                    friendsIDs: undefined,
                    friendOf: undefined,
                    friendOfIDs: undefined,
                    friendshipReqRec: undefined,
                    friendshipReqRecIDs: undefined,
                    friendshipReqSend: undefined,
                    friendshipReqSendIDs: undefined
                }
            })
            return res.json(newUser)
        } catch (error) {
            console.log(error);
        }
    }

    return res.json({
        success: false
    })
}