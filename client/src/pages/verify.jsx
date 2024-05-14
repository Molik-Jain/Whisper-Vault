import { Link, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import verifyImage from "/VerifiyImage2.png"
const Verify = () => {
  const { id, token } = useParams();

  const [validUrl, setValidUrl] = useState(true);
  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        // Update the URL with the full server address
        const { data } = await axios.get(`/verification/${id}/${token}`);
        console.log(data);
        setValidUrl(true);
      } catch (error) {
        console.error(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [id, token]); // Corrected dependency array

  return (
    <div>
      <Fragment>
        {validUrl ? (
          <div className="flex justify-center items-center py-20">
            <img
              src={verifyImage}
              alt="success_img"
              className="w-[500px] h-[500px] "

              //   className={styles.success_img}
            />
            {/* <h1>Email verified successfully</h1> */}
            <Link to="/login" className="absolute bottom-40 mb-20   w-[400px] h-[60px] flex items-center justify-center ">
              <button className="mt-10 w-[500px] h-[80px] "></button>
            </Link>
          </div>
        ) : (
          <h1>404 Not Found</h1>
        )}
      </Fragment>
    </div>
  );
};

export default Verify;
