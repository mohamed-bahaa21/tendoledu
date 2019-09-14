$(document).on("click", ".open-AddCrashCourse", function () {
    var crashCourseType = $(this).data('crash_course_type');
    $(".modal-body #courseType").val( crashCourseType );
    document.getElementById("courseTypeH").innerHTML = crashCourseType;
});