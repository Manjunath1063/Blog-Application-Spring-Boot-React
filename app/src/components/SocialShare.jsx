import React from "react";
import toast from "react-hot-toast";
import { CiFacebook, CiTwitter, CiLink } from "react-icons/ci";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

const SocialShare = ({ url ,onSelect}) => {
  const encodedUrl = encodeURIComponent(url);
  const text = encodeURIComponent("Check this out!");

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    instagram: `https://www.instagram.com/yourusername/`, // No direct share
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], "_blank");
    onSelect()
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied Successfully!")
    } catch (err) {
      alert("Failed to copy link.");
    }
    onSelect()
  };

  return (
    <div className="mt-2 flex justify-start items-center gap-2 text-[0.9rem] cursor-pointer">
      <FaWhatsapp
        onClick={() => handleShare("whatsapp")}
        title="Share on WhatsApp"
        className="hover:text-orange-600 duration-500"
      />
      <CiFacebook
        onClick={() => handleShare("facebook")}
        title="Share on Facebook"
        className="hover:text-orange-600 duration-500"
      />
      <FaInstagram
        onClick={() => handleShare("instagram")}
        title="Open Instagram"
        className="hover:text-orange-600 duration-500"
      />
      <CiTwitter
        onClick={() => handleShare("twitter")}
        title="Share on Twitter"
        className="hover:text-orange-600 duration-500"
      />
      <CiLink
        onClick={handleCopy}
        title="Copy link"
        className="hover:text-orange-600 duration-500"
      />
    </div>
  );
};

export default SocialShare;
