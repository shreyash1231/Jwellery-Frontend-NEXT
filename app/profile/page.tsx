import { Card } from "@/components/ui/card";

export default function Profile(){
    return(
        <div className="pl-20 pt-20">
            <div className="flex gap-5 justify-center">
                <Card className="w-80 h-57 flex flex-col text-left p-0">
                    <div className="justify-center pb-3 items-center text-xl font-bold border-b border-black px-4 pt-4">
                        Account Setting
                    </div>

                    <div className="justify-center pb-2 items-center text-xl font-semibold border-b border-black px-4">
                        Your Profile
                    </div>

                    <div className="justify-center pb-2 items-center text-xl font-semibold border-b border-black px-4">
                        Reset Password
                    </div>

                    <div className="justify-center items-center text-xl font-semibold px-4">
                        Delete
                    </div>
                </Card>
            </div>
        </div>
    );
}