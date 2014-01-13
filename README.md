LongForm
========

Convert numeric input to the equivalent words in a string


======== Problem Provided =========

Write some code that will accept an amount and convert it to the appropriate string representation. 

Example: 
Convert 2523.04 
 to "Two thousand five hundred twenty-three and 04/100 dollars"
 
 
====================================


The interface is simple. User enters numbers, user gets back text.

Some case handling:
Any decimal over 2 points is rounded up, e.g. 5.2353 = 5.24
The tool handles up to 999,999,999,999 . If the user enters 1 trillion or more, the tool will give back only into the billions.

Also, the assumption is made the user will not enter a negative amount.
