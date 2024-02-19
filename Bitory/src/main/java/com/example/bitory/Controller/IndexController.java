package com.example.bitory.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;



@Controller
public class IndexController {

	@GetMapping("/index")
    public String index(){

        return "index";
    }
	
	@GetMapping("/predict")
    public String predict(){

        return "predict/predict";
    }
	@GetMapping("/market")
    public String market(){

        return "market/market";
    }

    @GetMapping("/market/trade")
    public String Trade(){

        return "market/trade";
    }

    @GetMapping("/history")
    public String history(){

        return "record/history";
    }


    @GetMapping("/comparison")
    public String comparison(){

        return "record/comparison";
    }


    @GetMapping("/investGrade")
    public String investGrade(){

        return "record/investGrade";
    }


    @GetMapping("/virtualInvest")
    public String virtualInvest(){

        return "record/virtualInvest";
    }


}
