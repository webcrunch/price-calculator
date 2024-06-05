export const query_selector_handling = type => {
    return document.querySelector(`${type}`)
}

export const create_element = element => {
    return document.createElement(`${element}`)
}

export const get_element_id = id => {
    return document.getElementById(`${id}`)
}

export const init_array = () => [] 