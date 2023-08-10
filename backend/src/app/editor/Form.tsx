'use client';
import React from "react";

type FormProps = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    placeholder: string;
};

const FormComponent: React.FC<FormProps> = ({label, placeholder,onChange}) => {
    return (
        <form>
            <label>{label}</label>
            <br></br>
            <input type="text" placeholder={placeholder} onChange={onChange}/>
        </form>
    );
};

export default FormComponent;