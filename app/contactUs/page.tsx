import ContactUsCard from "@/components/Contact-Us";
import Footer from "@/components/Footer";
import { caramel } from "../fonts";


export default function ContactUs(){
    return(
        <div><h2 className={`${caramel.className} text-[50px] text-center text-[#b32126]`}>
                         Contact Us
                        </h2>
                        <div className="text-[20px] text-[#555] text-center">Send us your custom order request/ query/ emergency info or order/ message</div>
            <ContactUsCard/>
        </div>
    );
}