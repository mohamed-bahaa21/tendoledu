$(document).on("click", ".open-AddPreReq", function () {
    var preReqType = $(this).data('pre_type');
    $(".modal-body #preType").val(preReqType);
    document.getElementById("preTypeH").innerHTML = preReqType;
});