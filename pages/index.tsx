import { useAuth } from '@lib/auth'
import { Heading, Text, Code, Button } from "@chakra-ui/react"

export default function Home() {
    const { user, signinWithGitHub, signout } = useAuth()

    return (
        <div>
            <main>
                <Heading>
                    Your Feedback
                </Heading>


                <Text>
                    Current user: <Code>{user?.email || 'None'}</Code>
                </Text>

                <div style={{ display: 'flex' }}>
                    <Button style={{ marginRight: 10 }} onClick={() => signinWithGitHub()}>Sign In</Button>
                    {user && <Button onClick={() => signout()}>Sign Out</Button>}
                </div>
            </main>
        </div>
    )
}
