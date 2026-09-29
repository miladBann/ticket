import "bootstrap/dist/css/bootstrap.css";
import buildCient from "../api/build-client";
import PageHeader from "../components/header";

const AppComponent = ({Component, pageProps, currentUser}) => {
    return <div>
            <PageHeader currentUser={currentUser}/>
            <Component {...pageProps} />
        </div>
}

//getInitialProps for AppComponent
AppComponent.getInitialProps = async appContext => {
    const client = buildCient(appContext.ctx);
    const {data} = await client.get("/api/users/currentuser");

    let pageProps = {};
    if (appContext.Component.getInitialProps){
        //getInitialProps for other pages that has this function too (/pages/index.js)
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    
    return {
        pageProps,
        ...data
    }
}

export default AppComponent;