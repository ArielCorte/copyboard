import { type Copy } from "@prisma/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { ClipboardCopy, Plus, Trash2 } from "lucide-react";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, } from "~/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";

const Home: NextPage = () => {
    const [copyboardCode, setCopyboardCode] = useState("080091");
    const [copyContent, setCopyContent] = useState("");
    const [newCode, setNewCode] = useState("");

    const { data: copyboard, refetch } = api.copies.getCopyboardCopies.useQuery({ copyboardCode });

    const addCopy = api.copies.addCopy.useMutation({ onSuccess: () => refetch() });
    const removeCopy = api.copies.removeCopy.useMutation({ onSuccess: () => refetch() });

    const submitCopy = () => {
        addCopy.mutate({ content: copyContent, copyboardCode })
        setCopyContent("")
    }

    const deleteCopy = (id: string) => {
        removeCopy.mutate(id)
    }

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Copyboard gives you a clipboard that you can access from any browser, from any device." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="relative">
                <main className="p-4 h-dscreen overflow-y-scroll bg-purple-50">
                    <h1 className="text-4xl font-bold mb-4">Copy<span className="text-purple-800">Board</span></h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 grid-flow-row">
                        <div className="">
                            <Card className="">
                                <CardHeader>
                                    <h2 className="text-xl font-bold">Paste new copy</h2>
                                </CardHeader>
                                <CardContent className="flex gap-4">
                                    <Input
                                        type="text"
                                        placeholder="But that all changed when the Fire Nation attacked..."
                                        value={copyContent}
                                        onInput={(e: React.KeyboardEvent<HTMLInputElement>) => setCopyContent(e.currentTarget.value)} />
                                    <Button
                                        type="submit"
                                        onClick={() => submitCopy()}
                                    >
                                        Add
                                    </Button>
                                </CardContent>
                            </Card>
                            <Separator className="my-4" />
                            {copyboard && copyboard.copies.map((copy, index) => {
                                return <CopyCard key={index} deleteCopy={deleteCopy} {...copy} />
                            })}
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-4 flex gap-4 items-center">
                        <Dialog>
                            <DialogTrigger className="rounded-full p-2 bg-primary text-primary-foreground hover:bg-primary/90">
                                <Plus />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New CopyBoard</DialogTitle>
                                </DialogHeader>
                                <div className="flex justify-center">
                                    <Input
                                        type="text"
                                        className="text-4xl w-44"
                                        value={newCode}
                                        onInput={(e: React.KeyboardEvent<HTMLInputElement>) => setNewCode(e.currentTarget.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="submit" onClick={() => {
                                            setCopyboardCode(newCode)
                                        }}>
                                            Go
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                            <div className="mb-1">CopyBoard code:</div>
                            <div className="flex gap-2 items-center justify-center">
                                <div className="font-bold text-3xl bg-gray-400 p-1 rounded-md flex items-center justify-center">
                                    {copyboardCode}
                                </div>
                                <Button variant="outline">
                                    <ClipboardCopy />
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Home;

interface CopyCardProps extends Copy {
    deleteCopy: (copyId: string) => void
}

export const CopyCard: React.FC<CopyCardProps> = ({ deleteCopy, ...copy }) => {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <h2 className="">{copy.createdAt.toLocaleDateString()}</h2>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => deleteCopy(copy.id)}>
                        <Trash2 />
                    </Button>
                    <Button variant="outline">
                        <ClipboardCopy />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="bg-gray-200 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                    {copy.content}
                </div>
            </CardContent>
        </Card>
    )
}
