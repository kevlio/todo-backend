# Todo API [under construction] 

## A) General guidelines

1. URL: http://localhost:5000/todos, http://localhost:5000/todos/:id <br>*where id is a unique value of a specific Item. **See B) GET to see all Items available*
3. Example code is written in JS/Axios format

## B) GET /todos - Get all todos

    method: 'GET',
    url: 'http://localhost:5000/todos',
    headers: {'Content-Type': 'application/json'}

## C) GET /todos/:id - Get Todo by ID

    method: 'GET',
    url: 'http://localhost:5000/todos/:id',
    headers: {'Content-Type': 'application/json'}
    :id: Where id is a unique value (data-type Number) of the Item, to see all Items see section B) GET.

#### 404 - Not Found. The requested Item not found. **See B) GET to see all Items available*

## D) POST /todos - Add a todo

#### Data Requirements:

 1). Unique id Value<br>2). Correct Object Keys<br>3). Correct Value Datatype

    method: 'POST',
    url: 'http://localhost:5000/todos',
    headers: {'Content-Type': 'application/json'},
    data: {
    id: Number
    todo: String,
    date: String,
    time: String,
    prio: String,
    completed: Boolean
    }

### Status Codes

#### 201 - Created. Succesfully posted New Todo Item
#### 400 - Bad Request. Requirement 2) Object keys not fullfilled.
#### 422 - Unprocesseable Entity. Requirement 1) and/or 3) not fullfilled.

## E) PUT /todos/:id - Change a todo (full)

#### **Section D) Data Requirements*<br>
#### **Section B) Get all Items available by id*

     method: 'PUT',
     url: 'http://localhost:5000/todos/:id',
     headers: {'Content-Type': 'application/json'},
       data: {
       id: Number
       todo: String,
       date: String,
       time: String,
       prio: String,
       completed: Boolean 
       }

### Status Codes

#### 200 - OK. Succesfully changed Item with ID in the request
#### 400 - Bad Request. Object keys requirement not fullfilled. **See D) Data Requirements or* or F) PATCH for partial update
#### 404 - Not Found. The requested Item not found. **See B) GET to see all Items available*
#### 422 - Unprocesseable Entity. Object datatype error. **See D) Data Requirements*

## F) PATCH /todos/:id - Change Completion status

#### Data Requirements:
1). Data sent must be a Boolean value: true/false

    method: 'PATCH',
    url: 'http://localhost:5000/todos/:id',
    headers: {'Content-Type': 'application/json'},
    data: Boolean

### Status Codes
#### 200 - OK. Succesfully updated Item with :id
#### 404 - Not Found. The requested Item not found. **See B) GET to see all Items available*
#### 422 - Unprocesseable Entity. Requirement 1) not fullfilled.

## G) DELETE /todos/:id - Delete a todo

    method: 'DELETE',
    url: 'http://localhost:5000/todos/:id',
    headers: {'Content-Type': 'application/json'}

### Status Codes
#### 200 - OK. Succesfully deleted Item with :id
#### 404 - Not Found. The requested Item not found. **See B) GET to see all Items available* 
