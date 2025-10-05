export const signupCall = async( body ) => {
    
    var res = await fetch("http://localhost:8000/auth/signup/", {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(body)
    })

    // const data = await res.json();
    
    return res;
}
export const loginCall = async( body ) => {
    
    var res = await fetch("http://localhost:8000/auth/login/", {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(body)
    })

    // const data = await res.json();
    
    return res;
}
export const refreshCall = async( body ) => {
    
    var res = await fetch("http://localhost:8000/auth/refresh/", {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(body)
    })

    
    return res;
}


export const get_conversations = async(user_id) => {
    const token = localStorage.getItem('access_token');
    var res = await fetch(`http://localhost:8000/chat/conversations/${user_id}`, {
        method: "get",
        headers: new Headers({
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        })
    });    

    return res;
}

export const get_more_conversations = async(user_id, before_date) => {
    
    var res = await fetch(`http://localhost:8000/chat/conversations/${user_id}/${before_date}`, {
        method: "get",
        headers: new Headers({
            "Content-Type": "application/json"
        })
    });    

    return res;
}
export const get_conversation = async(conversation_id) => {
    const token = localStorage.getItem('access_token');
    var res = await fetch(`http://localhost:8000/chat/conversation/${conversation_id}`, {
        method: "get",
        headers: new Headers({
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        })
    });    

    console.log(res);
    return res;
}

export const delete_conversation = async(conversation_id) => {
    const token = localStorage.getItem('access_token');
    var res = await fetch(`http://localhost:8000/chat/conversations/${conversation_id}/delete/`, {
        method: 'DELETE',
        headers: new Headers({
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        })
    });    

    return res;
}
export const delete_message = async(user_message_id) => {
    
    var res = await fetch(`http://localhost:8000/chat/messages/${user_message_id}/delete/`, {
        method: "delete",
        headers: new Headers({
            "Content-Type": "application/json"
        })
    });    
    //const data = await res.json();
    // const data = await res.json();
    // console.log(data);
    return res;
}
export const generate_response = async( body ) => {
    
    var res = await fetch("http://localhost:8000/chat/generate-response/", {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: body
    })

    // const data = await res.json();
    
    return res;
}

export const generate_summary = async( body ) => {
    
    var res = await fetch("http://localhost:8000/chat/generate-summary/", {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: body
    })

    // const data = await res.json();
    
    return res;
}
