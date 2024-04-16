import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
const ShareFeature = ({ pc, i }) => {
  const shareUrl = "http://localhost:5173/dashboard";
  const hashtag = []
  pc.communities.map((h)=>hashtag.push("#"+h))

  return (
    <Dialog>
      <DialogTrigger>
        <i className="fa-solid fa-share mr-2 text-lg"></i>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share via</DialogTitle>
          <DialogDescription>
            <div className="flex items-center justify-between">
              <div>
                <WhatsappShareButton
                  url={`I'm just sharing a confession of unknown user\nFrom : Whisper-Vault  \nConfession: ${pc.content}`}
                  separator=" "
                >
                  <WhatsappIcon className="w-10"></WhatsappIcon>
                </WhatsappShareButton>

                {/* <WhatsappShareButton
                  url={`${quote} ${shareUrl}`} // Combine content and URL
                  // title={`Check out this image: ${pc.imageConfess}`} // Text including the image URL
                  separator="\n" // Separate lines for better readability
                > */}
              </div>
              <div>
                <TelegramShareButton
                  url={shareUrl}
                  quote={"Whisper-Vault"}
                  
                  title="Whisper23"
                >
                  <TelegramIcon className="w-10"></TelegramIcon>
                </TelegramShareButton>
              </div>
              <div>
                <FacebookShareButton
                  url={shareUrl}
                  quote={"Whisper-Vault"}
                  
                >
                  <FacebookIcon className="w-10"></FacebookIcon>
                </FacebookShareButton>
              </div>

              <div>
                <TwitterShareButton
                  url={`I'm just sharing a confession of unknown user\nFrom : Whisper-Vault  \nConfession: ${pc.content} \n ${hashtag}`}
                  quote={"Whisper-Vault"}
                  
                >
                  <TwitterIcon className="w-10"></TwitterIcon>
                </TwitterShareButton>
              </div>
              <div>
                <LinkedinShareButton
                  url={shareUrl}
                  quote={"Whisper-Vault"}
                  
                >
                  <LinkedinIcon className="w-10"></LinkedinIcon>
                </LinkedinShareButton>
              </div>
              <div></div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ShareFeature;
