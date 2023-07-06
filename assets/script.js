let myLibrary = [
    {
      title: "Twilight",
      author: "Stephenie Meyer",
      read: false
    }
  ];
  
  // DOM Objects
  $newButton = document.querySelector('.new');
  $table = document.querySelector('.table');
  $tbody = $table.querySelector('tbody');
  
  $form = document.querySelector('.form');
  $titleInput = $form.querySelector('#title');
  $authorInput = $form.querySelector('#author');
  $submitButton = $form.querySelector('#submit');
  $returnButon = $form.querySelector('#return');
  
  function Book(title, author, read) {
    this.title = title;
    this.author = author;
    this.read = read;
  }
  
  const addBookToLibrary = () => {
    let title = $titleInput.value;
    let author = $authorInput.value;
    let read = getReadValue();
    let newBook = new Book(title, author, read);
    myLibrary.push(newBook);
  }
  
  const populateStorage = () => {
    localStorage.setItem('library', JSON.stringify(myLibrary));
  }
  
  const getStorage = () => {
    myLibrary = JSON.parse(localStorage.getItem('library'));
  }
  
  const getReadValue = () => {
    if($form.querySelector('input[name="read"]:checked').value == 'yes') return true;
    else return false;
  }
  
  const toggleHiddenElements = () => {
    $form.classList.toggle('hidden');
    $table.classList.toggle('hidden');
    $newButton.classList.toggle('hidden');
  }
  
  const addError = (el) => {
    let $spanError = document.createElement('span');
    $spanError.textContent = `Please enter a ${el.id}`;
    $spanError.id = `${el.id}Error`
    $spanError.classList.add('errorText');
    $form.insertBefore($spanError, el);
  
    el.classList.add('errorInput');
  
    el.addEventListener('input', removeError);
  }
  
  const removeError = (el) => {
    if (el.target.value != '') {
      el.target.removeEventListener('input', removeError);
      el.target.classList.remove('errorInput');
      document.querySelector(`#${el.target.id}Error`).remove();
    }
  }
  
  const validateForm = () => {
    if ($titleInput.value == "" && document.querySelector('#titleError') == null) addError($titleInput);
    if ($authorInput.value == "" && document.querySelector('#authorError') == null) addError($authorInput);
    else return true;
  
  }
  
  const clearForm = () => {
    $titleInput.value = "";
    $authorInput.value = "";
  }
  
  const createReadStatusTd = (book) => {
    let $readStatusTd = document.createElement('td');
    let $readStatusButton = document.createElement('button');
    $readStatusButton.textContent = 'Change read status';
    $readStatusButton.addEventListener('click', () => {
      book.read = !book.read;
      updateTable();
    });
    $readStatusTd.appendChild($readStatusButton);
    return $readStatusTd;
  }
  
  const removeFromLibrary = (index) => {
    myLibrary.splice(index, 1)
    $submitButton.removeEventListener('click', removeFromLibrary);
    updateTable();
  }
  
  const createEditTd = (book, index) => {
    let $editTd = document.createElement('td');
    let $editButton = document.createElement('button');
    $editButton.textContent = 'Edit';
    $editButton.addEventListener('click', () => {
      $titleInput.value = book.title;
      $authorInput.value = book.author
      book.read ? $form.querySelector('#yes').checked = true : $form.querySelector('#no').checked = true;
      toggleHiddenElements();
      $submitButton.addEventListener('click', removeFromLibrary);
    });
    $editTd.appendChild($editButton);
    return $editTd;
  }
  
  const createDeleteTd = (index) => {
    let $deleteTd = document.createElement('td');
    let $deleteButton = document.createElement('button');
    $deleteButton.textContent = 'Delete';
    $deleteButton.addEventListener('click', () => {
      myLibrary.splice(index, 1);
      updateTable();
    });
    $deleteTd.appendChild($deleteButton);
    return $deleteTd;
  }
  
  const updateTable = () => {
    $tbody.textContent = '';
  
    myLibrary.forEach((book, index) => {
      let $row = document.createElement('tr');
      Object.keys(book).forEach(prop => {
        let $newTd = document.createElement('td');
        $newTd.textContent = book[prop];
        if (prop == 'read') $newTd.textContent = book[prop] ? 'Read' : 'Not read';
        $row.appendChild($newTd);
      }); 
  
      $row.appendChild(createReadStatusTd(book));
      $row.appendChild(createEditTd(book, index));
      $row.appendChild(createDeleteTd(index));
      $tbody.appendChild($row);
    });
  
    populateStorage();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    
    $newButton.addEventListener('click', toggleHiddenElements);
  
    $submitButton.addEventListener('click', () => {
      if (validateForm() == false) return;
      addBookToLibrary();
      updateTable();
      toggleHiddenElements();
      clearForm();
    });
  
    $returnButon.addEventListener('click', () => {
      toggleHiddenElements();
      clearForm();
    });
  
    if(!localStorage.getItem('library')) {
      populateStorage();
    } else {
      getStorage();
    }
  
    updateTable();
  });