import Head from "next/head.js";

const LibraryHead: React.FC = () => {
    return(
        <>
                <Head>
                    <title>Books - BookMarkt</title>
                    <meta name="description" content="List of all available books" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
        </>
    )

}

export default LibraryHead;