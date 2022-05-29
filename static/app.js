var train_data = {
    name: "",
    file: null
};
var recognize_data = {
    file:null
};
var message = null;
var active_section = null;
function render(){

    $('.form-item input').val('');
    $('.tabs li').removeClass('active');
    $('.tabs li:first').addClass('active');

    active_section = 'train-content';
    $('#'+active_section).show();
}

function update(){
    if(message){
        $('.message').html('<p class="'+_.get(message,'type')+'">'+_.get(message,'message')+'</p>');
    }
    $('#train-content, #recognize-content').hide();
    $('#'+active_section).show();

}

$(document).ready(function(){

    $('#train #input-file').on('change',function(event){
        // console.log("File is added with file is:",event.target.files);
        train_data.file = _.get(event,'target.files[0]',null);
    });
    $('#name-field').on('change',function(event){
        train_data.name = _.get(event,'target.value','');
    });

    $('.tabs li').on('click',function(e){
        var $this = $(this);
        console.log("You are click on this section",$this.data('section'));
        active_section = $this.data('section');
        $('.tabs li').removeClass('active');
        $this.addClass('active');
        update();
    });
    $('#train').submit(function(event){
        message = null;
        if(train_data.name && train_data.file){
            var train_form_data = new FormData();
            train_form_data.append('name',train_data.name);
            train_form_data.append('file',train_data.file);
            axios.post('api/train',train_form_data).then(function(response){

                message = {type:'success',message:'Training has been done,user with id is:'+_.get(response,'data.id')};
                train_data = {name:'',file:null};
                update();

            }).catch(function(error){
                message = {type: 'error',messsage:_.get(error,'response.data.error.message','Unknown error.')}
                update();
            });

        }
        else{
            message = {type:"error",message:"Name and face image is required."}
        }
        update();
        event.preventDefault();
    });

    $('#recognize-input-file').on('change',function(e){
        recognize_data.file = _.get(e,'target.files[0]',null);
    });
    $('#recognize').submit(function(e){
        console.log("Recognize is submitted",recognize_data);
        var recog_form_data = new FormData();
        recog_form_data.append('file',recognize_data.file);
        axios.post('/api/recognize',recog_form_data).then(function(response){
            console.log("We found a user matched with your face image is",response.data);
            message = {type:'success',message:"We found a user matched with your face image is"+response.data.user.name};
            update();
        }).catch(function(err){
            message = {type:'error',message:_.get(err,'response.data.error.message','Unknown error')};
            update();
        });
        e.preventDefault();
    });

    render();
});

