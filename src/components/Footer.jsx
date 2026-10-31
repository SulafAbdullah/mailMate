//this is the Footer component for the MailMate application. 
// src/components/Footer.jsx
import { Mail, X } from 'lucide-react';


export default function Footer({ t = {} }) {
return(
    <footer className="border-t border-slate-200 bg-brand text-brand-dark py-4 px-6 mt-8 shadow-xs">
    <div className="max-w-6xl mx-auto flex flex-col text-slate-500 gap-3 items-center">
        <div className="flex items-center gap-3 text-brand-light font-brand text-lg">
         <p className=" mt-0.5 ">
            {t.contactUs} 
        </p>
        <a href="mailto:mailmateapp.sa@gmail.com" className=" hover:text-brand-dark">
            <Mail className="w-4 h-4"/>
        </a>
        <a href="https://x.com/supermodeleng" target="_blank" rel="noopener noreferrer" className=" hover:text-slate-800">
            <X className="w-4 h-4"/> 
        </a>
        </div>
        <div className="flex flex-col text-center gap-1 text-brand-lighter/50 font-brand text-sm">
            
        <p>
            {t.createdBy}
        </p>
        <p >
            {t.copyright}
        </p>
        </div>

    </div>
    </footer>
)
}
