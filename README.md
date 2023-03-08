# library_project
Library project involving prototypes
~~~
lib is created at pageload - first, 'get' library array at page load
create functions for this and stringify functions

add function to handle other 'Submit' functions along with prototype (check notes)
Make Query button the default - two submit buttons with no onsubmit? other way?
~~~
TODO: 'Remove' btn functionality
    --Remove should have a confirmation
TODO: Improve modal; always center on screen?
TODO: Click (with confirmation) to change from Complete? Yes to No


Add a “NEW BOOK” button that brings up a form allowing users to input the details for the new book: author, title, number of pages, whether it’s been read and anything else you might want. You will most likely encounter an issue where submitting your form will not do what you expect it to do. That’s because the submit input tries to send the data to a server by default. If you’ve done the bonus section for the calculator assignment, you might be familiar with event.preventDefault();. Read up on the event.preventDefault documentation again and see how you can solve this issue!

Add a button on each book’s display to remove the book from the library.
You will need to associate your DOM elements with the actual book objects in some way. One easy solution is giving them a data-attribute that corresponds to the index of the library array.
Add a button on each book’s display to change its read status.

To facilitate this you will want to create the function that toggles a book’s read status on your Book prototype instance.
