import { Link, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";

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
          <div className="">
            <img
              src=""
              alt="success_img"
              //   className={styles.success_img}
            />
            <h1>Email verified successfully</h1>
            <Link to="/login">
              <button>Login</button>
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
