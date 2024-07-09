const root = document.getElementById('root')

const init = async () => {
    if(!root){
        console.error('No root element')
        return
    }
    const posts = await getPosts()
    const users = await getUsers()
    const comments = await getComments()
    
    renderPosts(posts, users, comments)
}

const getPosts = async () => {
    const resp = await fetch('https://jsonplaceholder.typicode.com/posts')
    const data = await resp.json()
    return data
}

const getComments = async () => {
    const resp = await fetch('https://jsonplaceholder.typicode.com/comments')
    const res  = await resp.json()
    return res
}

const getUsers = async () => {
    const resp = await fetch('https://jsonplaceholder.typicode.com/users')
    const res = resp.json()
    return res
}
//розмітка меню
const Header = document.getElementById('Header')
const header = () => {
    
    const headerList = document.createElement('div')
    
    const logo = document.createElement('h1')
    const btnList = document.createElement('div')
    const like = document.createElement('button')
    const message = document.createElement('button')
    
    headerList.classList.add('headerList')
    logo.classList.add('logo')
    btnList.classList.add('btnList')
    like.classList.add('like')
    message.classList.add('message')
    
    logo.innerText = 'Mygram'
    like.innerHTML = '&#9825'
    message.innerHTML = '&#9993;'

    btnList.appendChild(like)
    btnList.appendChild(message)

    headerList.appendChild(logo)
    headerList.appendChild(btnList)

    Header.appendChild(headerList)
}
header()
//розмітка постів
const renderPosts = (listOfPosts, listOfUsers, listOfComments) => {

    const list = document.createElement('ul')
    list.classList.add('post__list')

    listOfPosts.forEach((post) => {
        const user = listOfUsers.find(user => user.id === post.userId)

        const item = document.createElement('li')
        const name = document.createElement('h2')
        const content = document.createElement('div')
        const com = document.createElement('button')
        const likeBtn = document.createElement('button')
        
        item.classList.add('post__item')
        name.classList.add('post__name')
        content.classList.add('post__content')
        com.classList.add('post__comments')
        likeBtn.classList.add('like__btn')
        
        name.innerHTML = `&#128100; ${user ? user.name : 'Unknown User'}`
        content.innerText = post.body
        com.innerHTML = '&#128172;'
        likeBtn.innerHTML = '&#9825'
        //випадаюче меню
        const dropMenu = document.createElement('ul')
        dropMenu.classList.add('drop__menu')
        dropMenu.style.display = 'none'

        const sendItem = document.createElement('li')
        sendItem.innerText = 'Send'
        const followItem = document.createElement('li')
        followItem.innerText = 'Follow'
        const removeItem = document.createElement('li')
        removeItem.innerText = 'Remove'

        dropMenu.appendChild(sendItem)
        dropMenu.appendChild(followItem)
        dropMenu.appendChild(removeItem)

        name.appendChild(dropMenu)

        name.addEventListener('mouseover', () => {
            dropMenu.style.display = 'block'
        })
        name.addEventListener('mouseout', () => {
            dropMenu.style.display = 'none'
        })
        //прослуховувач на клік по клавіші
        com.addEventListener('click',() => {
            const existingComment = item.querySelector('.list__com')
            if (existingComment){
                item.removeChild(existingComment)
            } else {
                const postComments = listOfComments.filter(comment => comment.id === post.id)
                renderComments(postComments,item)
            }
        })

        likeBtn.addEventListener('click', () => {
            likeBtn.classList.toggle('red')
        })
        
        item.appendChild(name)
        item.appendChild(content)
        item.appendChild(com)
        item.appendChild(likeBtn)
        
        list.appendChild(item)
    })
    root.appendChild(list)
}
// розмітка коментів
const renderComments = (comments, postElement) => {
    const listCom = document.createElement('ul')
    listCom.classList.add('list__com')
    
    comments.forEach((comment)=> {
        const commentItem = document.createElement('li')
        const commentName = document.createElement('h3')
        const commentBody = document.createElement('div')
        const deleteComment = document.createElement('button')

        commentItem.classList.add('post__commentItem')
        commentName.classList.add('post__commentName')
        commentBody.classList.add('post__commentBody')
        deleteComment.classList.add('post__deleteComment')

        commentName.innerText = comment.email
        commentBody.innerText = comment.body
        deleteComment.innerText = 'Delete'
        //запит на видалення коментів теж з прослуховувачем
        deleteComment.addEventListener('click', async () => {
            const resp = await fetch(`https://jsonplaceholder.typicode.com/comments/${comment.id}`, {
                method: 'DELETE'
            })
            if (resp) {
                commentItem.remove()
            } else {
                console.error('Failed to delete comment')
            }
        })

        commentItem.appendChild(commentName)
        commentItem.appendChild(commentBody)
        commentItem.appendChild(deleteComment)

        listCom.appendChild(commentItem)
    })
    postElement.querySelectorAll('.list__com').forEach(existingComment => {
        postElement.removeChild(existingComment)
    });
    postElement.appendChild(listCom)
}

init()



