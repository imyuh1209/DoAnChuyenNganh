import { Divider } from "antd";
import CompanyCard from "../../components/client/card/company.card";
import JobCard from "../../components/client/card/job.card";
import styles from '../../styles/client.module.scss'

const HomePage = () => {
    return (
        <>
            <div className={`${styles["container"]} ${styles["home-section"]}`}>
                <Divider />
                <CompanyCard />
                <div style={{ margin: 50 }}></div>
                <Divider />
                <JobCard />
            </div>
            

        </>
    )
    
}

export default HomePage;