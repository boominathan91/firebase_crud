 // Initialize Firebase
 var config = {
     apiKey: "AIzaSyAioHXAcgviSTJ12wfziv56KHJSpVlGBvM",
     authDomain: "ang-crud-39220.firebaseapp.com",
     databaseURL: "https://ang-crud-39220.firebaseio.com",
     projectId: "ang-crud-39220",
     storageBucket: "ang-crud-39220.appspot.com",
     messagingSenderId: "41818324081"
 };
 firebase.initializeApp(config);
 var db = firebase.database().ref('products');
 var initialFetch = false;


 // Add Popup 
 $('.btn_add').click(function() {
     $('.modal-title').text('Add Product');
     $('form')[0].reset();
     $('#pop_up').modal('show');
 });


 // Save btn Click 
 $('.btn_save').click(function() {
     var sku = $('#sku').val();
     var description = $('#description').val();
     var price = $('#price').val();
     var id = $('#hidden_id').val();

     if (id == '') {
         if (sku != '' && description != '' && price != '') {
             var datas = db.push();
             datas.set({
                 sku: sku,
                 description: description,
                 price: price
             });
             $('#pop_up').modal('hide');
             $('#new_form')[0].reset();

             toastr.success("Product added successfully ", "Success", {
                 "timeOut": "0",
                 "extendedTImeout": "0"
             });
         }
     } else {
         if (sku != '' && description != '' && price != '') {

             firebase.database().ref('products/' + id).update({
                 sku: sku,
                 description: description,
                 price: price
             });
             $('#pop_up').modal('hide');
             $('#new_form')[0].reset();
             toastr.success("Product updated successfully ", "Success", {
                 "timeOut": "0",
                 "extendedTImeout": "0"
             });
         }

     }


 });

 // Read the Data from Database 

 db.once('value', function(snapshot) {
     if (snapshot.exists()) {
         var content = '';
         var i = 0;
         snapshot.forEach(function(data) {
             var val = data.val();
             var key = data.key;
             i++;
             content += '<tr id="row_' + key + '">' +
                 '<td>' + i + '</td>' +
                 '<td><span id="sku_' + key + '">' + val.sku + '</span></td>' +
                 '<td><span id="description_' + key + '">' + val.description + '</span></td>' +
                 '<td><span id="price_' + key + '">' + val.price + '</span></td>' +
                 '<td><button class="btn btn-primary btn-xs btn_edit" key="' + key + '">Edit</button> ' +
                 '<button class="btn btn-danger btn-xs btn_delete" key="' + key + '">Delete</button>' +
                 '</td>' +
                 '</tr>';
         });
         $('#total_count').val(i);
         $('.table').append(content);

         // Edit Button Click 
         $('.btn_edit').click(function() {
             $('.modal-title').text('Edit Product');
             var id = $(this).attr('key');
             var sku = $('#sku_' + id).text();
             var description = $('#description_' + id).text();
             var price = $('#price_' + id).text();

             $('#sku').val(sku);
             $('#description').val(description);
             $('#price').val(price);
             $('#hidden_id').val(id);
             $('#pop_up').modal('show');
         });


         // Delete Button Click 
         $('.btn_delete').click(function() {
             if (confirm('Are you sure to delete this data ? ')) {
                 var key = $(this).attr('key');
                 db.child(key).remove();
             }

         });

         initialFetch = true;



     }
 });


 // changes from Database will update here 

 db.on('child_changed', (data) => {
     var val = data.val();
     var key = data.key;
     $('#sku_' + key).text(val.sku);
     $('#description_' + key).text(val.description);
     $('#price_' + key).text(val.price);
 });

 // remove  data from database  
 db.on('child_removed', (data) => {
     var val = data.val();
     var key = data.key;
     $('#row_' + key).remove();
 });

 db.on('child_added', (data) => {
     if (!initialFetch) return;
     var val = data.val();
     var key = data.key;
     var app = '';
     var count = $('#total_count').val();
     count++;
     app += '<tr>' +
         '<td>' + count + '</td>' +
         '<td><span id="sku_' + key + '">' + val.sku + '</span></td>' +
         '<td><span id="description_' + key + '">' + val.description + '</span></td>' +
         '<td><span id="price_' + key + '">' + val.price + '</span></td>' +
         '<td><button class="btn btn-primary btn-xs" >Edit</button> ' +
         '<button class="btn btn-danger btn-xs">Delete</button>' +
         '</td>' +
         '</tr>';
     $('.table').append(app);
 });