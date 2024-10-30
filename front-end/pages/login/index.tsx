import Head from "next/head.js";
import Header from "../../components/header";

import React from "react";

const Login: React.FC = () => {
  return (
    <>
      <Head>
        <title>BookMarkt</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div >
        <Header></Header>
        <main className="p-1 flex-grow flex justify-center items-center">
            <section>
            <h2>Login</h2>
            <form className="form">

                <label htmlFor="username">Username:</label>
                <input
                type="text"
                id="username"
                name="username"
                required
                />

                <label htmlFor="password">Password:</label>
                <input
                type="password"
                id="password"
                name="password"
                required
                />

                <button type="submit" className="register-button">
                    Login
                </button>
            </form>
            <p>Create an account? <a href="/register">register</a></p>
            </section>
        </main>
      </div>
    </>
  );
}
export default Login;